import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { bonkDecimals, bonkMint, platformId, stakePid } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeDepositReceiptStruct } from './structs';
import { stakeDepositReceiptFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    stakeDepositReceiptStruct,
    stakePid,
    stakeDepositReceiptFilter(owner)
  );
  if (accounts.length === 0) return [];

  const bonkTokenPrice = await cache.getTokenPrice(bonkMint, NetworkId.solana);
  const assets: PortfolioAsset[] = [];
  for (const account of accounts) {
    const lockedUntil =
      (account.depositTimestamp.toNumber() +
        account.lockupDuration.toNumber()) *
      1000;
    if (account.depositAmount.isZero()) continue;

    assets.push({
      ...tokenPriceToAssetToken(
        bonkMint,
        account.depositAmount.dividedBy(10 ** bonkDecimals).toNumber(),
        NetworkId.solana,
        bonkTokenPrice
      ),
      attributes: {
        lockedUntil,
      },
    });
  }

  if (assets.length === 0) return [];
  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
