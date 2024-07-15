import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  farmingPoolPayload,
  farmingPoolsKey,
  platformId,
  thlCoin,
} from './constants';
import {
  coinStore,
  getAccountResources,
  getView,
  isCoinStoreRessourceType,
  parseTypeString,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { PoolInfo, StakeAndRewardAmount } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();

  const [farmingPools, resources] = await Promise.all([
    cache.getItem<PoolInfo[]>(farmingPoolsKey, {
      prefix: platformId,
      networkId: NetworkId.aptos,
    }),
    getAccountResources(client, owner),
  ]);

  if (!farmingPools) return [];
  if (!resources) return [];

  const walletCoinTypes = resources
    .map((resource) => {
      const resourceType = resource.type;
      if (!isCoinStoreRessourceType(resourceType)) return null;
      const parseCoinType = parseTypeString(resourceType);
      if (parseCoinType.root !== coinStore) return null;
      if (!parseCoinType.keys) return null;
      const coinType = parseCoinType.keys.at(0)?.type;
      if (coinType === undefined) return null;
      return coinType;
    })
    .filter((c) => c !== null) as string[];

  // WE KEEP FARMING POOL ONLY IF LP TOKEN IS IN WALLET
  const selectedFarmingPools = farmingPools
    .map((fp, poolId) => ({ ...fp, poolId }))
    .filter((fp) => walletCoinTypes.includes(fp.stake_coin));

  if (selectedFarmingPools.length === 0) return [];

  let stakedTokens = (
    await Promise.all(
      selectedFarmingPools.map(async (farmingPool) => {
        const rewardCoinType = thlCoin;
        const vRes = await getView(
          client,
          farmingPoolPayload(owner, farmingPool.poolId, rewardCoinType)
        );
        if (vRes && vRes[0] && vRes[0] !== '0') {
          const amount = vRes[0] as string;
          const reward = vRes[1] as string;
          return {
            poolId: farmingPool.poolId,
            coinType: farmingPool.stake_coin,
            amount,
            rewards: [
              {
                amount: reward,
                coinType: rewardCoinType,
              },
            ],
          };
        }
        return null;
      })
    )
  ).filter((sra) => sra !== null) as StakeAndRewardAmount[];

  stakedTokens = await Promise.all(
    stakedTokens.map(async (s) => {
      const pool = farmingPools[s.poolId];
      if (pool.extra_reward_coins) {
        for (const rewardCoinType of pool.extra_reward_coins) {
          const vRes = await getView(
            client,
            farmingPoolPayload(owner, s.poolId, rewardCoinType)
          );

          if (vRes && vRes[1] && vRes[1] !== '0') {
            const reward = vRes[1] as string;
            s.rewards.push({
              amount: reward,
              coinType: rewardCoinType,
            });
          }
        }
      }
      return s;
    })
  );

  if (!stakedTokens || stakedTokens.length === 0) return [];

  const tokenMints = new Set<string>();
  stakedTokens.forEach((st) => {
    tokenMints.add(st.coinType);
    st.rewards.forEach((r) => tokenMints.add(r.coinType));
  });
  const tokenPrices = await cache.getTokenPricesAsMap(
    [...tokenMints],
    NetworkId.aptos
  );

  const liquidities: PortfolioLiquidity[] = [];

  stakedTokens.forEach((stakedToken) => {
    const rewardAssets: PortfolioAsset[] = [];
    const tokenPrice = tokenPrices.get(
      formatMoveTokenAddress(stakedToken.coinType)
    );
    if (!tokenPrice) return;

    const asset = tokenPriceToAssetToken(
      stakedToken.coinType,
      new BigNumber(stakedToken.amount)
        .dividedBy(tokenPrice.decimals)
        .toNumber(),
      NetworkId.aptos,
      tokenPrice
    );

    stakedToken.rewards.forEach((r) => {
      if (r.amount === '0') return;
      const rewardTokenPrice = tokenPrices.get(
        formatMoveTokenAddress(r.coinType)
      );
      if (!rewardTokenPrice) return;
      rewardAssets.push(
        tokenPriceToAssetToken(
          r.coinType,
          new BigNumber(r.amount)
            .dividedBy(rewardTokenPrice.decimals)
            .toNumber(),
          NetworkId.aptos,
          rewardTokenPrice
        )
      );
    });

    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((a) => a.value));
    const value = (asset.value || 0) + (rewardAssetsValue || 0);

    liquidities.push({
      assets: [asset],
      assetsValue: asset.value,
      rewardAssets,
      rewardAssetsValue,
      value,
      yields: [],
    });
  });

  if (liquidities.length === 0) return [];

  return [
    {
      networkId: NetworkId.aptos,
      label: 'Farming',
      platformId,
      type: PortfolioElementType.liquidity,
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-farming-pools`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
