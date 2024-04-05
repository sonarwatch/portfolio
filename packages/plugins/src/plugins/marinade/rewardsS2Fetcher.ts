import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  baseRewardsUrl,
  mndeDecimals,
  mndeMint,
  platformId,
  season2RewardsPrefix,
  season2Route,
  season2Unlock,
} from './constants';
import { Season2Response } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const promises = [
    cache.getTokenPrice(mndeMint, NetworkId.solana),
    cache.getItem<Season2Response>(owner, {
      prefix: season2RewardsPrefix,
      networkId: NetworkId.solana,
    }),
  ] as const;

  // eslint-disable-next-line prefer-const
  let [mndeTokenPrice, season2Rewards] = await Promise.all(promises);

  const assets: PortfolioAsset[] = [];
  if (!season2Rewards) {
    const getSeason2Rewards: AxiosResponse<Season2Response> | null = await axios
      .get(baseRewardsUrl + season2Route + owner)
      .catch(() => null);
    if (getSeason2Rewards) {
      season2Rewards = getSeason2Rewards.data;
      await cache.setItem(owner, season2Rewards, {
        prefix: season2RewardsPrefix,
        networkId: NetworkId.solana,
        ttl: 1000 * 60 * 60 * 5,
      });
    }
  }

  if (season2Rewards) {
    if (season2Rewards.staker.mSOLRewards) {
      const stakingRewardAmount = new BigNumber(
        season2Rewards.staker.mSOLRewards
      );
      if (!stakingRewardAmount.isZero()) {
        assets.push({
          ...tokenPriceToAssetToken(
            mndeMint,
            stakingRewardAmount.dividedBy(10 ** mndeDecimals).toNumber(),
            NetworkId.solana,
            mndeTokenPrice,
            undefined,
            {
              lockedUntil: season2Unlock.getTime(),
              tags: ['Staking'],
            }
          ),
        });
      }
    }
    if (season2Rewards.governor.vemndeDirectedStakeVotesRewards) {
      const governorRewardAmount = new BigNumber(
        season2Rewards.governor.vemndeDirectedStakeVotesRewards
      );
      if (!governorRewardAmount.isZero()) {
        assets.push({
          ...tokenPriceToAssetToken(
            mndeMint,
            governorRewardAmount.dividedBy(10 ** mndeDecimals).toNumber(),
            NetworkId.solana,
            mndeTokenPrice,
            undefined,
            {
              lockedUntil: season2Unlock.getTime(),
              tags: ['Governor'],
            }
          ),
        });
      }
    }
    if (season2Rewards.validator.algoScoreRewards) {
      const validatorRewardAmount = new BigNumber(
        season2Rewards.validator.algoScoreRewards
      );
      if (!validatorRewardAmount.isZero()) {
        assets.push({
          ...tokenPriceToAssetToken(
            mndeMint,
            validatorRewardAmount.dividedBy(10 ** mndeDecimals).toNumber(),
            NetworkId.solana,
            mndeTokenPrice,
            undefined,
            {
              lockedUntil: season2Unlock.getTime(),
              tags: ['Validator'],
            }
          ),
        });
      }
    }
  }
  if (assets.length === 0) return [];
  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Rewards',
      networkId: NetworkId.solana,
      platformId,
      name: 'Season 2',
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-rewards-s2`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
