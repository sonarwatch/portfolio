import { NetworkId } from '@sonarwatch/portfolio-core';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { normalizeStructTag } from '@mysten/sui/utils';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import {
  baseIndexRate,
  borrowIncentivePoolsKey,
  borrowIncentivePoolsPrefix,
} from '../constants';
import {
  AddressInfo,
  MarketJobResult,
  PoolAddress,
  PoolAddressMap,
} from '../types';
import {
  BorrowIncentivePoolFields,
  BorrowIncentivePoolPointFields,
  BorrowIncentivePoolPoints,
  BorrowIncentivePools,
  BorrowIncentivePoolsQueryInterface,
  ParsedBorrowIncentivePoolPointData,
} from '../types/borrowIncentivePool';
import { hasSCoinPredicate } from '../helpers';

const calculatePoolPoint = (
  parsedBorrowIncentivePoolPointData: ParsedBorrowIncentivePoolPointData,
  {
    rewardDecimals,
    rewardCoinPrice,
    poolDecimals,
    poolCoinPrice,
  }: {
    rewardDecimals: number;
    rewardCoinPrice: number;
    poolDecimals: number;
    poolCoinPrice: number;
  }
) => {
  const distributedPointPerSec = BigNumber(
    parsedBorrowIncentivePoolPointData.distributedPointPerPeriod
  ).dividedBy(parsedBorrowIncentivePoolPointData.period);

  const now = Math.floor(Date.now() / 1000);
  const timeDelta = BigNumber(
    now - parsedBorrowIncentivePoolPointData.lastUpdate
  )
    .dividedBy(parsedBorrowIncentivePoolPointData.period)
    .toFixed(0);

  const accumulatedPoints = BigNumber.minimum(
    BigNumber(timeDelta).multipliedBy(
      parsedBorrowIncentivePoolPointData.distributedPointPerPeriod
    ),
    BigNumber(parsedBorrowIncentivePoolPointData.points)
  );

  const currentPointIndex = BigNumber(
    parsedBorrowIncentivePoolPointData.index
  ).plus(
    accumulatedPoints
      .dividedBy(parsedBorrowIncentivePoolPointData.weightedAmount)
      .isFinite()
      ? BigNumber(baseIndexRate)
          .multipliedBy(accumulatedPoints)
          .dividedBy(parsedBorrowIncentivePoolPointData.weightedAmount)
      : 0
  );

  const currentTotalDistributedPoint = BigNumber(
    parsedBorrowIncentivePoolPointData.distributedPoint
  ).plus(accumulatedPoints);

  const baseWeight = BigNumber(parsedBorrowIncentivePoolPointData.baseWeight);
  // staked amount applied with weight
  const weightedStakedAmount = BigNumber(
    parsedBorrowIncentivePoolPointData.weightedAmount
  );

  const weightedStakedCoin = weightedStakedAmount.shiftedBy(-poolDecimals);
  const weightedStakedValue = weightedStakedCoin.multipliedBy(poolCoinPrice);

  // Calculate the reward rate
  const rateYearFactor = 365 * 24 * 60 * 60;
  const rewardPerSec = BigNumber(distributedPointPerSec).shiftedBy(
    -rewardDecimals
  );

  const rewardValueForYear = BigNumber(rewardPerSec)
    .multipliedBy(rateYearFactor)
    .multipliedBy(rewardCoinPrice);

  const weightScale = BigNumber(1_000_000_000_000);
  const rewardRate =
    rewardValueForYear
      .multipliedBy(
        BigNumber(parsedBorrowIncentivePoolPointData.baseWeight).dividedBy(
          weightScale
        )
      )
      .dividedBy(weightedStakedValue)
      .isFinite() && parsedBorrowIncentivePoolPointData.points > 0
      ? rewardValueForYear
          .multipliedBy(
            BigNumber(parsedBorrowIncentivePoolPointData.baseWeight).dividedBy(
              weightScale
            )
          )
          .dividedBy(weightedStakedValue)
          .toNumber()
      : Infinity;
  return {
    distributedPointPerSec: distributedPointPerSec.toNumber(),
    accumulatedPoints: accumulatedPoints.toNumber(),
    currentPointIndex: currentPointIndex.toNumber(),
    currentTotalDistributedPoint: currentTotalDistributedPoint.toNumber(),
    baseWeight: baseWeight.toNumber(),
    weightedStakedAmount: weightedStakedAmount.toNumber(),
    weightedStakedCoin: weightedStakedCoin.toNumber(),
    weightedStakedValue: weightedStakedValue.toNumber(),
    rewardApr: rewardRate,
    rewardPerSec: rewardPerSec.toNumber(),
  };
};

const parseBorrowIncentivePoolPoint = (
  point: BorrowIncentivePoolPointFields
) => ({
  pointType: normalizeStructTag(point.point_type.name),
  distributedPointPerPeriod: Number(point.distributed_point_per_period),
  period: Number(point.point_distribution_time),
  distributedPoint: Number(point.distributed_point),
  points: Number(point.points),
  index: Number(point.index),
  baseWeight: Number(point.base_weight),
  weightedAmount: Number(point.weighted_amount),
  lastUpdate: Number(point.last_update),
  createdAt: Number(point.created_at),
});

const parseBorrowIncentivePools = async (
  poolAddress: PoolAddressMap,
  incentivePools: BorrowIncentivePoolFields[],
  market: MarketJobResult,
  cache: Cache
) => {
  const poolAddressValue = Object.values(poolAddress);
  const borrowIncentivePools: BorrowIncentivePools = {};
  const conversionRateMap = Object.values(market).reduce(
    (acc, { conversionRate, coinType }) => {
      acc[coinType] = conversionRate;
      return acc;
    },
    {} as Record<string, number>
  );

  const tokenPrices: Record<string, number> = Array.from(
    (
      await cache.getTokenPricesAsMap(
        [...poolAddressValue.map((t) => t.coinType)],
        NetworkId.sui
      )
    ).values()
  ).reduce((acc, { address, price }) => {
    const sCoinType = poolAddress[address]?.sCoinType;
    if (sCoinType) {
      acc[sCoinType] = price * conversionRateMap[address];
    }
    acc[address] = price;
    return acc;
  }, {} as Record<string, number>);

  // also

  const sCoinPoolAddress = poolAddressValue
    .filter(hasSCoinPredicate)
    .reduce(
      (
        acc,
        { sCoinName, sCoinType, sCoinSymbol, decimals, sCoinMetadataId }
      ) => {
        acc[sCoinType] = {
          coinName: sCoinName,
          coinType: sCoinType,
          symbol: sCoinSymbol,
          coinMetadataId: sCoinMetadataId,
          decimals,
        };
        return acc;
      },
      {} as Record<string, PoolAddress>
    );

  for (const pool of incentivePools) {
    const borrowIncentivePoolPoints: Record<string, BorrowIncentivePoolPoints> =
      {};
    const poolType = normalizeStructTag(pool.pool_type.name);

    const parsedBorrowIncentivePoolData = {
      poolType,
      minStakes: Number(pool.min_stakes),
      maxStakes: Number(pool.max_stakes),
      staked: Number(pool.stakes),
      poolPoints: pool.points.map((t) => parseBorrowIncentivePoolPoint(t)),
    };

    const poolData = poolAddress[poolType];
    if (!poolData) return undefined;

    const { coinName: poolCoinName, decimals: poolDecimals, symbol } = poolData;
    // const poolCoinPrice = coinPrices?.[poolCoinName] ?? 0;
    // const poolCoinDecimal = query.utils.getCoinDecimal(poolCoinName);

    // pool points for borrow incentive reward
    for (const poolPoint of parsedBorrowIncentivePoolData.poolPoints) {
      const rewardCoinType = poolPoint.pointType;

      const rewardPoolData =
        sCoinPoolAddress[rewardCoinType] ?? poolAddress[rewardCoinType];
      if (!rewardPoolData) continue;

      const {
        coinName: rewardCoinName,
        decimals: rewardDecimals,
        symbol: rewardSymbol,
      } = rewardPoolData;

      const calculatedPoolPoint = calculatePoolPoint(poolPoint, {
        rewardDecimals,
        rewardCoinPrice: tokenPrices[rewardCoinType],
        poolDecimals,
        poolCoinPrice: tokenPrices[poolType],
      });

      borrowIncentivePoolPoints[rewardCoinType] = {
        symbol: rewardSymbol,
        coinName: rewardCoinName,
        coinType: rewardCoinType,
        decimals: rewardDecimals,
        // coinPrice: rewardCoinPrice,
        points: poolPoint.points,
        distributedPoint: poolPoint.distributedPoint,
        weightedAmount: poolPoint.weightedAmount,
        ...calculatedPoolPoint,
      };
    }

    const stakedAmount = BigNumber(parsedBorrowIncentivePoolData.staked);
    const stakedCoin = stakedAmount.shiftedBy(-poolDecimals);
    // const stakedValue = stakedCoin.multipliedBy(poolCoinPrice);

    if (Object.values(borrowIncentivePoolPoints).length === 0) continue;
    borrowIncentivePools[poolType] = {
      coinName: poolCoinName,
      symbol,
      coinType: poolType,
      decimals: poolDecimals,
      // coinPrice: poolCoinPrice,
      stakedAmount: stakedAmount.toNumber(),
      stakedCoin: stakedCoin.toNumber(),
      // stakedValue: stakedValue.toNumber(),
      points: borrowIncentivePoolPoints,
    };
  }

  return borrowIncentivePools;
};

const queryBorrowIncentivePools = async (
  client: SuiClient,
  {
    addressInfo,
    poolAddress,
    market,
  }: {
    addressInfo: AddressInfo;
    poolAddress: PoolAddressMap;
    market: MarketJobResult;
  },
  cache: Cache
) => {
  const queryPkgId = addressInfo.mainnet.borrowIncentive.query;
  const incentivePoolsId = addressInfo.mainnet.borrowIncentive.incentivePools;

  const tx = new Transaction();

  const target = `${queryPkgId}::incentive_pools_query::incentive_pools_data`;
  const args = [tx.object(incentivePoolsId)];
  tx.moveCall({
    target,
    arguments: args,
    typeArguments: [],
  });

  const queryResult = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender:
      '0x6a1d2b8e3dc6f0aeea9ed91a0cd3694ede9a86da52bc734fa261c8beb4c03f4b',
  });

  const borrowIncentivePoolsQueryData = queryResult?.events[0].parsedJson as
    | BorrowIncentivePoolsQueryInterface
    | undefined;

  if (!borrowIncentivePoolsQueryData) return;

  const parsedData = await parseBorrowIncentivePools(
    poolAddress,
    borrowIncentivePoolsQueryData.incentive_pools,
    market,
    cache
  );

  if (parsedData) {
    await cache.setItem(borrowIncentivePoolsKey, parsedData, {
      prefix: borrowIncentivePoolsPrefix,
      networkId: NetworkId.sui,
    });
  }
};

export default queryBorrowIncentivePools;
