import {
  NetworkId,
  PortfolioAsset,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketsInfoKey, platformId, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { sandglassAccountStruct } from './structs';
import { userAccountFilters } from './filters';
import { MarketInfo } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    sandglassAccountStruct,
    programId,
    userAccountFilters(owner)
  );

  if (accounts.length === 0) return [];

  const marketsInfos = await cache.getItem<MarketInfo[]>(marketsInfoKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!marketsInfos) return [];

  const marketInfoById: Map<string, MarketInfo> = new Map();
  marketsInfos.forEach((marketInfo) =>
    marketInfoById.set(marketInfo.pubkey.toString(), marketInfo)
  );

  const mints = marketsInfos
    .map((marketInfo) => [
      marketInfo.ptMint,
      marketInfo.ytMint,
      marketInfo.lpMint,
      // marketInfo.syMint,
    ])
    .flat();
  const tokenPriceById = await cache.getTokenPricesAsMap(
    mints,
    NetworkId.solana
  );

  const assets: PortfolioAsset[] = [];
  for (const account of accounts) {
    const market = marketInfoById.get(account.marketAccount.toString());
    if (!market) continue;

    const { stakePtAmount, stakeYtAmount, stakeLpAmount } = account.stakeInfo;
    const ptPrice = tokenPriceById.get(market.ptMint);
    const ytPrice = tokenPriceById.get(market.ytMint);
    const lpPrice = tokenPriceById.get(market.lpMint);

    if (ptPrice && !stakePtAmount.isZero()) {
      const amount = stakePtAmount.dividedBy(10 ** ptPrice.decimals).toNumber();
      assets.push(
        tokenPriceToAssetToken(market.ptMint, amount, NetworkId.solana, ptPrice)
      );
    }

    if (ytPrice && !stakeYtAmount.isZero()) {
      const amount = stakeYtAmount.dividedBy(10 ** ytPrice.decimals).toNumber();
      assets.push(
        tokenPriceToAssetToken(market.ytMint, amount, NetworkId.solana, ytPrice)
      );
    }

    if (lpPrice && !stakeLpAmount.isZero()) {
      const amount = stakeLpAmount.dividedBy(10 ** lpPrice.decimals).toNumber();
      assets.push(
        tokenPriceToAssetToken(market.lpMint, amount, NetworkId.solana, lpPrice)
      );
    }
  }

  if (assets.length === 0) return [];

  return [
    {
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      type: 'multiple',
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      data: {
        assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
