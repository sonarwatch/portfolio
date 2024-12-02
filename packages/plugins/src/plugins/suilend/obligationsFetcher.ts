import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  formatTokenAddress,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  marketsKey,
  obligationOwnerCapType,
  packageId,
  platformId,
} from './constants';
import { getClientSui } from '../../utils/clients';
import {
  LendingMarket,
  MarketsInfo,
  Obligation,
  ObligationCapFields,
} from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getPoolsRewardsMaps, getRatesAsMap } from './helpers';
import { wadsDecimal } from '../save/constants';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const obligationsCapFields =
    await getOwnedObjectsPreloaded<ObligationCapFields>(client, owner, {
      filter: { Package: packageId },
    });
  if (obligationsCapFields.length === 0) return [];

  const obligationsId: string[] = [];
  for (const obligationCapField of obligationsCapFields) {
    const type = obligationCapField.data?.content?.type;
    if (!type?.startsWith(obligationOwnerCapType)) continue;

    const obligationId = obligationCapField.data?.content?.fields.obligation_id;
    if (obligationId) obligationsId.push(obligationId);
  }

  const obligations = await multiGetObjects<Obligation>(client, obligationsId);
  if (obligations.length === 0) return [];

  const mints: Set<string> = new Set();
  const marketsInfo = await cache.getItem<MarketsInfo>(marketsKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
  const lendingMarkets = marketsInfo?.lendingMarkets;
  const rates = marketsInfo?.rates;
  const ratesByReserveId = getRatesAsMap(rates);
  const marketsByIndex: Map<string, LendingMarket> = new Map();
  if (lendingMarkets)
    marketsInfo.lendingMarkets.forEach((market) => {
      marketsByIndex.set(market.id.id, market);
    });
  const [poolRewardById, poolsRewardByManagerId] =
    getPoolsRewardsMaps(lendingMarkets);
  poolRewardById.forEach((pool) =>
    pool ? mints.add(pool.coin_type.fields.name) : undefined
  );

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];
  const suppliedLtvs: number[] = [];
  const borrowedWeights: number[] = [];

  obligations.forEach((obj) => {
    if (obj.data && obj.data.content) {
      obj.data.content.fields.deposits.forEach((dep) =>
        mints.add(dep.fields.coin_type.fields.name)
      );
      obj.data.content.fields.borrows.forEach((bor) =>
        mints.add(bor.fields.coin_type.fields.name)
      );
    }
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.sui
  );

  for (const obligation of obligations) {
    const { data } = obligation;
    if (!data || !data.content) continue;

    const market = marketsByIndex.get(data.content.fields.lending_market_id);
    if (!market) continue;

    const { reserves } = market;
    const {
      deposits,
      borrows,
      user_reward_managers: userRewardManagers,
    } = data.content.fields;

    // Deposits
    for (const deposit of deposits) {
      const { fields } = deposit;
      const reserve = reserves.at(Number(fields.reserve_array_index));
      if (!reserve) continue;

      const reserveBorrowAmount = new BigNumber(
        reserve.fields.borrowed_amount.fields.value
      ).dividedBy(10 ** wadsDecimal);
      const reserveAvailableAmount = new BigNumber(
        reserve.fields.available_amount
      );
      const cSupply = new BigNumber(reserve.fields.ctoken_supply);
      const cRatio = reserveAvailableAmount
        .plus(reserveBorrowAmount)
        .dividedBy(cSupply);

      const tokenPrice = tokenPriceById.get(
        formatTokenAddress(fields.coin_type.fields.name, NetworkId.sui)
      );

      const reserveRates = ratesByReserveId.get(reserve.fields.id.id);
      if (reserveRates) {
        suppliedYields.push([reserveRates.depositYield]);
      }

      const amount = new BigNumber(fields.deposited_ctoken_amount)
        .multipliedBy(cRatio)
        .dividedBy(10 ** reserve.fields.mint_decimals);
      const price = new BigNumber(fields.market_value.fields.value)
        .dividedBy(10 ** 18)
        .dividedBy(amount);

      suppliedAssets.push(
        tokenPriceToAssetToken(
          formatTokenAddress(fields.coin_type.fields.name, NetworkId.sui),
          amount.toNumber(),
          NetworkId.sui,
          tokenPrice,
          price.toNumber()
        )
      );
      suppliedLtvs.push(
        reserve.fields.config.fields.element.fields.max_close_ltv_pct / 100
      );
    }

    // Borrows
    for (const borrow of borrows) {
      const { fields: userBorrowFields } = borrow;
      const reserve = reserves.at(Number(userBorrowFields.reserve_array_index));
      if (!reserve) continue;

      const tokenPrice = tokenPriceById.get(
        formatTokenAddress(
          userBorrowFields.coin_type.fields.name,
          NetworkId.sui
        )
      );
      if (!tokenPrice) continue;

      const cumulativeRateRatio = new BigNumber(
        reserve.fields.cumulative_borrow_rate.fields.value
      ).dividedBy(userBorrowFields.cumulative_borrow_rate.fields.value);

      const amount = new BigNumber(
        userBorrowFields.borrowed_amount.fields.value
      )
        .times(cumulativeRateRatio)
        .dividedBy(10 ** (wadsDecimal + tokenPrice.decimals));
      if (amount.isZero()) continue;

      const reserveRates = ratesByReserveId.get(reserve.fields.id.id);
      if (reserveRates) {
        borrowedYields.push([reserveRates.borrowYield]);
      }

      const price = new BigNumber(userBorrowFields.market_value.fields.value)
        .dividedBy(10 ** wadsDecimal)
        .dividedBy(amount);

      borrowedAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          amount.toNumber(),
          NetworkId.sui,
          tokenPrice,
          price.toNumber()
        )
      );

      const borrowWeight = new BigNumber(
        reserve.fields.config.fields.element.fields.borrow_weight_bps
      ).dividedBy(10 ** 4);
      borrowedWeights.push(borrowWeight.toNumber());
    }

    // Rewards
    if (!poolRewardById) continue;

    const rewardAmountByMint: Map<string, BigNumber> = new Map();
    for (const userRewardManager of userRewardManagers) {
      const share = new BigNumber(userRewardManager.fields.share);

      for (const userReward of userRewardManager.fields.rewards) {
        if (!userReward) continue;

        const poolReward = poolRewardById.get(userReward.fields.pool_reward_id);
        if (!poolReward) continue;

        const rewardMint = poolReward.coin_type.fields.name;

        const cumulativeAmount = new BigNumber(
          poolReward.cumulative_rewards_per_share.fields.value
        )
          .minus(userReward.fields.cumulative_rewards_per_share.fields.value)
          .times(share)
          .dividedBy(10 ** wadsDecimal);

        if (cumulativeAmount.isLessThanOrEqualTo(0)) continue;

        const previousAmount = rewardAmountByMint.get(rewardMint);
        if (previousAmount) {
          rewardAmountByMint.set(
            rewardMint,
            previousAmount.plus(cumulativeAmount)
          );
        } else {
          rewardAmountByMint.set(rewardMint, cumulativeAmount);
        }
      }

      if (userRewardManager.fields.rewards.length === 0) {
        const poolsRewards = poolsRewardByManagerId.get(
          userRewardManager.fields.pool_reward_manager_id
        );

        if (poolsRewards) {
          for (const poolReward of poolsRewards) {
            if (!poolReward) continue;
            const amount = new BigNumber(
              poolReward.cumulative_rewards_per_share.fields.value
            )
              .times(share)
              .dividedBy(10 ** wadsDecimal);

            const previousAmount = rewardAmountByMint.get(
              poolReward.coin_type.fields.name
            );
            if (previousAmount) {
              rewardAmountByMint.set(
                poolReward.coin_type.fields.name,
                previousAmount.plus(amount)
              );
            } else {
              rewardAmountByMint.set(poolReward.coin_type.fields.name, amount);
            }
          }
        }
      }
    }

    rewardAmountByMint.forEach((amount, mint) => {
      const tokenPrice = tokenPriceById.get(
        formatTokenAddress(mint, NetworkId.sui)
      );

      if (tokenPrice)
        rewardAssets.push({
          ...tokenPriceToAssetToken(
            tokenPrice.address,
            amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
            NetworkId.sui,
            tokenPrice
          ),
          attributes: { isClaimable: true },
        });
    });
  }

  if (
    suppliedAssets.length === 0 &&
    borrowedAssets.length === 0 &&
    rewardAssets.length === 0
  )
    return [];

  const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
    getElementLendingValues({
      suppliedAssets,
      borrowedAssets,
      rewardAssets,
      suppliedLtvs,
      borrowedWeights,
    });

  const element: PortfolioElement = {
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.sui,
    platformId,
    label: 'Lending',
    value,
    data: {
      borrowedAssets,
      borrowedValue,
      borrowedYields,
      suppliedAssets,
      suppliedValue,
      suppliedYields,
      healthRatio,
      rewardAssets,
      rewardValue,
      value,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-obligations`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
