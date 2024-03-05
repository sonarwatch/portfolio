import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId, shadowDecimals, shadowMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { userStateStruct } from '../kamino/structs/vaults';
import { userStateFilter } from '../kamino/filters';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userStateAccounts = await getParsedProgramAccounts(
    client,
    userStateStruct,
    programId,
    userStateFilter(owner)
  );

  const tokenPrice = await cache.getTokenPrice(shadowMint, NetworkId.solana);

  const assets: PortfolioAsset[] = [];
  for (const userState of userStateAccounts) {
    if (userState.activeStakeScaled.isZero()) continue;
    const amount = userState.activeStakeScaled
      .dividedBy(10 ** 18)
      .dividedBy(10 ** shadowDecimals)
      .toNumber();

    assets.push(
      ...tokenPriceToAssetTokens(
        shadowMint,
        amount,
        NetworkId.solana,
        tokenPrice
      )
    );
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
