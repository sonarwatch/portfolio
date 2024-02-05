import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { flpStakeStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getPdas } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const stakeAccounts = await getParsedMultipleAccountsInfo(
    client,
    flpStakeStruct,
    getPdas(owner)
  );

  const pools = stakeAccounts.map((stakeAccount) =>
    stakeAccount ? stakeAccount.pool.toString() : ''
  );
  const flpMints = await cache.getItems<string[]>(pools, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!flpMints) return [];

  const flpMintById: Map<string, string> = new Map();
  for (let i = 0; i < flpMints.length; i++) {
    const flpMint = flpMints[i];
    const stakeAccount = stakeAccounts[i];
    if (flpMint && stakeAccount)
      flpMintById.set(stakeAccount.pubkey.toString(), flpMint[0]);
  }

  const tokenPrices = await cache.getTokenPrices(
    Array.from(flpMintById.values()),
    NetworkId.solana
  );

  const assets: PortfolioAsset[] = [];
  for (let j = 0; j < stakeAccounts.length; j++) {
    const stakeAccount = stakeAccounts[j];
    if (!stakeAccount) continue;

    const flpTokenPrice = tokenPrices[j];
    if (!flpTokenPrice) continue;

    const amount = stakeAccount.stakeStats.activeAmount
      .plus(stakeAccount.stakeStats.pendingActivation)
      .dividedBy(10 ** flpTokenPrice.decimals);

    assets.push(
      tokenPriceToAssetToken(
        flpTokenPrice.address,
        amount.toNumber(),
        NetworkId.solana,
        flpTokenPrice
      )
    );
  }

  if (assets.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      label: 'Staked',
      platformId,
      type: PortfolioElementType.multiple,
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      data: {
        assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-stake`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
