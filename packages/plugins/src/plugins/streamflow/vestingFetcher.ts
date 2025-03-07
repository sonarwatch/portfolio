import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, streamflowProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { withdrawalVestingAccountFilters } from './filters';
import { vestingAccountStruct } from './structs';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import getTokensDetailsMap from '../../utils/misc/getTokensDetailsMap';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const vestingAccounts = await getParsedProgramAccounts(
    client,
    vestingAccountStruct,
    streamflowProgramId,
    withdrawalVestingAccountFilters(owner)
  );

  if (vestingAccounts.length === 0) return [];

  const tokensAddresses = vestingAccounts.map((a) => a.mint.toString());
  const tokenPriceById = await getTokenPricesMap(
    tokensAddresses,
    NetworkId.solana,
    cache
  );

  const tokenDetailsById = await getTokensDetailsMap(
    tokensAddresses,
    NetworkId.solana,
    cache
  );

  const assets: PortfolioAsset[] = [];

  for (let i = 0; i < vestingAccounts.length; i += 1) {
    const vestingAccount = vestingAccounts[i];

    if (
      vestingAccount.withdrawnAmount.toNumber() >=
      vestingAccount.netAmountDeposited.toNumber()
    )
      continue;
    if (!vestingAccount.canceledAt.isZero()) continue;

    const tokenMint = vestingAccount.mint.toString();
    const tokenInCache = tokenPriceById.get(tokenMint);

    const decimals =
      tokenInCache?.decimals ||
      tokenDetailsById.get(tokenMint)?.decimals ||
      (await client.getTokenSupply(new PublicKey(tokenMint))).value.decimals;
    if (!decimals) continue;

    const tokenFactor = 10 ** decimals;

    const netAmount = vestingAccount.netAmountDeposited
      .div(tokenFactor)
      .toNumber();
    const withdrawnAmount = vestingAccount.withdrawnAmount
      .div(tokenFactor)
      .toNumber();
    const amount = netAmount - withdrawnAmount;

    const asset = tokenPriceToAssetToken(
      tokenMint,
      amount,
      NetworkId.solana,
      tokenInCache
    );
    assets.push({
      ...asset,
      attributes: {
        lockedUntil: vestingAccount.endTime.multipliedBy(1000).toNumber(),
      },
      ref: vestingAccount.pubkey.toString(),
      link: `https://app.streamflow.finance/contract/solana/mainnet/${vestingAccount.pubkey.toString()}`,
    });
  }

  if (assets.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      label: 'Vesting',
      platformId,
      type: PortfolioElementType.multiple,
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: {
        assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-vesting`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
