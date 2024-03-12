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
  obligationOwnerCapType,
  packageId,
  platformId,
  poolsKey,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { Obligation, ObligationCapFields, RewardInfo } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const suilendObjects = await getOwnedObjects(client, owner, {
    filter: { Package: packageId },
  });

  const mints: Set<string> = new Set();
  const rewardsInfo = await cache.getItem<RewardInfo[]>(poolsKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
  const rewardInfoById: Map<string, string> = new Map();
  if (rewardsInfo)
    rewardsInfo.forEach((rI) => {
      rewardInfoById.set(rI.poolId, rI.rewardMint);
      mints.add(rI.rewardMint);
    });

  const obligationsId: string[] = [];
  for (const object of suilendObjects) {
    const { data } = object;
    if (!data || !data.content) continue;

    const { type } = data.content;
    if (!type || !type.startsWith(obligationOwnerCapType)) continue;

    const fields = data.content.fields as ObligationCapFields;

    if (fields.obligation_id) obligationsId.push(fields.obligation_id);
  }

  const obligationsObjects = await multiGetObjects<Obligation>(
    client,
    obligationsId
  );

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  obligationsObjects.forEach((obj) => {
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

  for (const obligation of obligationsObjects) {
    const { data } = obligation;
    if (!data || !data.content) continue;

    const {
      deposits,
      borrows,
      user_reward_managers: rewardManagers,
    } = data.content.fields;
    for (const deposit of deposits) {
      const { fields } = deposit;
      const tokenPrice = tokenPriceById.get(
        formatTokenAddress(fields.coin_type.fields.name, NetworkId.sui)
      );
      if (!tokenPrice) continue;

      const amount = new BigNumber(fields.deposited_ctoken_amount).dividedBy(
        10 ** tokenPrice.decimals
      );
      const price = new BigNumber(fields.market_value.fields.value)
        .dividedBy(10 ** 18)
        .dividedBy(amount);

      suppliedAssets.push(
        ...tokenPriceToAssetTokens(
          tokenPrice.address,
          amount.toNumber(),
          NetworkId.sui,
          tokenPrice,
          price.toNumber()
        )
      );
    }
    for (const borrow of borrows) {
      const { fields } = borrow;
      const tokenPrice = tokenPriceById.get(
        formatTokenAddress(fields.coin_type.fields.name, NetworkId.sui)
      );
      if (!tokenPrice) continue;

      const amount = new BigNumber(
        fields.borrowed_amount.fields.value
      ).dividedBy(10 ** 24);
      if (amount.isZero()) continue;

      const price = new BigNumber(fields.market_value.fields.value)
        .dividedBy(10 ** 18)
        .dividedBy(amount);

      borrowedAssets.push(
        ...tokenPriceToAssetTokens(
          tokenPrice.address,
          amount.toNumber(),
          NetworkId.sui,
          tokenPrice,
          price.toNumber()
        )
      );
    }

    const rewardAmountByMint: Map<string, BigNumber> = new Map();
    for (const rewardManager of rewardManagers) {
      for (const reward of rewardManager.fields.rewards) {
        const rewardMint = rewardInfoById.get(reward.fields.pool_reward_id);
        if (!rewardMint) continue;

        const amount = new BigNumber(rewardManager.fields.share)
          .times(
            new BigNumber(
              reward.fields.cumulative_rewards_per_share.fields.value
            )
          )
          .dividedBy(10 ** 18);
        if (amount.isZero()) continue;

        const previousAmount = rewardAmountByMint.get(rewardMint);
        if (previousAmount) {
          rewardAmountByMint.set(rewardMint, previousAmount.plus(amount));
        } else {
          rewardAmountByMint.set(rewardMint, amount);
        }
      }
    }

    rewardAmountByMint.forEach((amount, mint) => {
      const tokenPrice = tokenPriceById.get(
        formatTokenAddress(mint, NetworkId.sui)
      );

      if (tokenPrice)
        rewardAssets.push(
          ...tokenPriceToAssetTokens(
            tokenPrice.address,
            amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
            NetworkId.sui,
            tokenPrice
          )
        );
    });
  }

  const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
    getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

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
      collateralRatio: null,
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
