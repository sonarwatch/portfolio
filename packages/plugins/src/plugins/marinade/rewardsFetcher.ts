import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  baseRewardsUrl,
  mndeMint,
  platformId,
  referrerRoute,
  season2RewardsPrefix,
  season2Route,
} from './constants';
import { ReferreResponse, Season2Response } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getClientSolana } from '../../utils/clients';
import { claimRecordStruct } from './structs';
import { getClaimPda } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const decimals = 9;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const mndeTokenPrice = await cache.getTokenPrice(mndeMint, NetworkId.solana);
  if (!mndeTokenPrice) return [];
  const season1Unlock = new Date(1704067200000); // January 1 2024
  const season2Unlock = new Date(1711843200000); // March 31 2024
  const client = getClientSolana();
  const pda = getClaimPda(owner);
  const claimRecord = await getParsedAccountInfo(
    client,
    claimRecordStruct,
    pda
  );

  const getReferrerRewards: AxiosResponse<ReferreResponse> | null = await axios
    .get(baseRewardsUrl + referrerRoute + owner)
    .catch(() => null);

  const season1Assets: PortfolioAsset[] = [];
  const elements: PortfolioElement[] = [];
  if (claimRecord && !claimRecord.nonClaimedAmount.isZero()) {
    season1Assets.push({
      ...tokenPriceToAssetToken(
        mndeMint,
        claimRecord.nonClaimedAmount.dividedBy(10 ** decimals).toNumber(),
        NetworkId.solana,
        mndeTokenPrice
      ),
      attributes: {
        lockedUntil: season1Unlock.getTime(),
        tags: ['Staking'],
      },
    });
  }
  if (getReferrerRewards) {
    const rewardAmount = new BigNumber(getReferrerRewards.data.rewards);
    if (!rewardAmount.isZero()) {
      season1Assets.push({
        ...tokenPriceToAssetToken(
          mndeMint,
          rewardAmount.dividedBy(10 ** decimals).toNumber(),
          NetworkId.solana,
          mndeTokenPrice
        ),
        attributes: {
          lockedUntil: season2Unlock.getTime(),
          tags: ['Referrer'],
        },
      });
    }
  }
  if (season1Assets.length > 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Rewards',
      networkId: NetworkId.solana,
      platformId,
      name: 'Season 1',
      data: { assets: season1Assets },
      value: getUsdValueSum(season1Assets.map((asset) => asset.value)),
    });
  }

  const season2Assets: PortfolioAsset[] = [];

  let season2Rewards = await cache.getItem<Season2Response>(owner, {
    prefix: season2RewardsPrefix,
    networkId: NetworkId.solana,
  });

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
    const stakingRewardAmount = new BigNumber(
      season2Rewards.staker.mSOLRewards
    );
    if (!stakingRewardAmount.isZero()) {
      season2Assets.push({
        ...tokenPriceToAssetToken(
          mndeMint,
          stakingRewardAmount.dividedBy(10 ** decimals).toNumber(),
          NetworkId.solana,
          mndeTokenPrice
        ),
        attributes: {
          lockedUntil: season2Unlock.getTime(),
          tags: ['Staking'],
        },
      });
    }
    const governorRewardAmount = new BigNumber(
      season2Rewards.governor.vemndeDelStratVotesRewards
    );
    if (!governorRewardAmount.isZero()) {
      season2Assets.push({
        ...tokenPriceToAssetToken(
          mndeMint,
          governorRewardAmount.dividedBy(10 ** decimals).toNumber(),
          NetworkId.solana,
          mndeTokenPrice
        ),
        attributes: {
          lockedUntil: season2Unlock.getTime(),
          tags: ['Governor'],
        },
      });
    }
    const validatorRewardAmount = new BigNumber(
      season2Rewards.validator.algoScoreRewards
    );
    if (!validatorRewardAmount.isZero()) {
      season2Assets.push({
        ...tokenPriceToAssetToken(
          mndeMint,
          validatorRewardAmount.dividedBy(10 ** decimals).toNumber(),
          NetworkId.solana,
          mndeTokenPrice
        ),
        attributes: {
          lockedUntil: season2Unlock.getTime(),
          tags: ['Validator'],
        },
      });
    }
  }
  if (season2Assets.length > 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Rewards',
      networkId: NetworkId.solana,
      platformId,
      name: 'Season 2',
      data: { assets: season2Assets },
      value: getUsdValueSum(season2Assets.map((asset) => asset.value)),
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-rewards`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
