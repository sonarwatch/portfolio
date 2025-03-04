import {
  NetworkId,
  PortfolioElementType,
  getUsdValueSum,
  PortfolioElementLiquidity,
  aprToApy,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  allbridgeIdlItem,
  cachePrefix,
  platformId,
  poolsCacheKey,
  SYSTEM_PRECISION,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getAutoParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Pools, UserDeposit } from './types';
import { getEarned, getUserDepositPublicKeys } from './helpers';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const poolInfoMemo = new MemoizedCache<Pools>(poolsCacheKey, {
  prefix: cachePrefix,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const poolInfo = await poolInfoMemo.getItem(cache);

  if (!poolInfo) throw new Error('Pool info not cached');

  const userDepositPublicKeys = getUserDepositPublicKeys(poolInfo, owner);

  const userDeposits = (
    await getAutoParsedMultipleAccountsInfo<UserDeposit>(
      connection,
      allbridgeIdlItem,
      userDepositPublicKeys
    )
  ).filter(
    (userDeposit): userDeposit is ParsedAccount<UserDeposit> =>
      userDeposit !== null && userDeposit?.lpAmount !== '0'
  );

  if (userDeposits.length === 0) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    poolInfo.tokens.map((pi) => pi.tokenAddress),
    NetworkId.solana
  );

  const elements: PortfolioElementLiquidity[] = [];

  userDeposits.forEach((userDeposit) => {
    const tokenPool = poolInfo.tokens.find(
      (tp, i) => userDepositPublicKeys[i] === userDeposit.pubkey
    );
    if (!tokenPool) return;
    const tokenPrice = tokenPrices.get(tokenPool.tokenAddress);
    if (!tokenPrice) return;

    const lpAsset = tokenPriceToAssetToken(
      tokenPool.tokenAddress,
      new BigNumber(userDeposit.lpAmount)
        .dividedBy(10 ** SYSTEM_PRECISION)
        .toNumber(),
      NetworkId.solana,
      tokenPrice
    );

    const rewardValue = getEarned(
      userDeposit.lpAmount,
      userDeposit.rewardDebt,
      tokenPool.poolInfo.accRewardPerShareP,
      tokenPool.poolInfo.p
    )
      .dividedBy(10 ** tokenPool.decimals)
      .toNumber();

    const rewardsAssets = [];
    if (rewardValue > 0)
      rewardsAssets.push(
        tokenPriceToAssetToken(
          tokenPool.tokenAddress,
          rewardValue,
          NetworkId.solana,
          tokenPrice
        )
      );

    const value = getUsdValueSum([
      lpAsset.value,
      ...rewardsAssets.map((ra) => ra.value),
    ]);

    elements.push({
      networkId: NetworkId.solana,
      label: 'LiquidityPool',
      platformId,
      type: PortfolioElementType.liquidity,
      value,
      data: {
        liquidities: [
          {
            assets: [lpAsset],
            assetsValue: lpAsset.value,
            rewardAssets: rewardsAssets,
            rewardAssetsValue: getUsdValueSum(
              rewardsAssets.map((ra) => ra.value)
            ),
            value,
            yields: [
              {
                apy: aprToApy(Number(tokenPool.apr)),
                apr: Number(tokenPool.apr),
              },
            ],
            ref: userDeposit.pubkey.toString(),
            sourceRefs: [
              {
                address: tokenPool.poolAddress,
                name: 'Pool',
              },
            ],
            link: 'https://core.allbridge.io/pools?chain=SOL',
          },
        ],
      },
      name: tokenPool.name,
    });
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
