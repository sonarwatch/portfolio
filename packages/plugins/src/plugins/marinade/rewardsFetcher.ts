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
  claimProgram,
  mndeMint,
  platformId,
  referrerRoute,
  season2Route,
} from './constants';
import { ReferreResponse, Season2Response } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { claimRecordStruct } from './structs';
import { claimRecordFilters } from './filters';

const decimals = 9;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const mndeTokenPrice = await cache.getTokenPrice(mndeMint, NetworkId.solana);
  if (!mndeTokenPrice) return [];
  const season1Unlock = new Date(1704067200000); // January 1 2024
  const season2Unlock = new Date(1711843200000); // March 31 2024
  const assets: PortfolioAsset[] = [];
  const client = getClientSolana();
  const claimRecords = await getParsedProgramAccounts(
    client,
    claimRecordStruct,
    claimProgram,
    claimRecordFilters(owner)
  );

  if (claimRecords.length === 1 && !claimRecords[0].nonClaimedAmount.isZero()) {
    assets.push({
      ...tokenPriceToAssetToken(
        mndeMint,
        claimRecords[0].nonClaimedAmount.dividedBy(10 ** decimals).toNumber(),
        NetworkId.solana,
        mndeTokenPrice
      ),
      attributes: {
        lockedUntil: season1Unlock.getTime(),
        tags: ['season 1'],
      },
    });
  }

  const getSeason2Rewards: AxiosResponse<Season2Response> | null = await axios
    .get(baseRewardsUrl + season2Route + owner)
    .catch(() => null);

  if (getSeason2Rewards) {
    const rewardAmount = new BigNumber(getSeason2Rewards.data.mSOLRewards);
    if (!rewardAmount.isZero()) {
      assets.push({
        ...tokenPriceToAssetToken(
          mndeMint,
          rewardAmount.dividedBy(10 ** decimals).toNumber(),
          NetworkId.solana,
          mndeTokenPrice
        ),
        attributes: {
          lockedUntil: season2Unlock.getTime(),
          tags: ['season 2'],
        },
      });
    }
  }

  const getReferrerRewards: AxiosResponse<ReferreResponse> | null = await axios
    .get(baseRewardsUrl + referrerRoute + owner)
    .catch(() => null);

  if (getReferrerRewards) {
    const rewardAmount = new BigNumber(getReferrerRewards.data.rewards);
    if (!rewardAmount.isZero()) {
      assets.push({
        ...tokenPriceToAssetToken(
          mndeMint,
          rewardAmount.dividedBy(10 ** decimals).toNumber(),
          NetworkId.solana,
          mndeTokenPrice
        ),
        attributes: {
          lockedUntil: season2Unlock.getTime(),
          tags: ['referrer'],
        },
      });
    }
  }

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Rewards',
      networkId: NetworkId.solana,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-rewards`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
