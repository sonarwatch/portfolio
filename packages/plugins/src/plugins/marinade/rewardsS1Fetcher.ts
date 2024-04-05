import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { mndeDecimals, mndeMint, platformId, season1Unlock } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getClientSolana } from '../../utils/clients';
import { claimRecordStruct } from './structs';
import { getClaimPda } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const promises = [
    cache.getTokenPrice(mndeMint, NetworkId.solana),
    getParsedAccountInfo(client, claimRecordStruct, getClaimPda(owner)),
    // axios
    //   .get<unknown, AxiosResponse<ReferreResponse>>(
    //     baseRewardsUrl + referrerRoute + owner
    //   )
    //   .catch(() => null),
  ] as const;

  const [mndeTokenPrice, claimRecord] = await Promise.all(promises);

  const assets: PortfolioAsset[] = [];
  if (claimRecord && !claimRecord.nonClaimedAmount.isZero()) {
    assets.push({
      ...tokenPriceToAssetToken(
        mndeMint,
        claimRecord.nonClaimedAmount.dividedBy(10 ** mndeDecimals).toNumber(),
        NetworkId.solana,
        mndeTokenPrice,
        undefined,
        {
          lockedUntil: season1Unlock.getTime(),
          tags: ['Staking'],
        }
      ),
    });
  }

  // if (getReferrerRewards) {
  //   const rewardAmount = new BigNumber(getReferrerRewards.data.rewards);
  //   if (!rewardAmount.isZero()) {
  //     assets.push({
  //       ...tokenPriceToAssetToken(
  //         mndeMint,
  //         rewardAmount.dividedBy(10 ** mndeDecimals).toNumber(),
  //         NetworkId.solana,
  //         mndeTokenPrice,
  //         undefined,
  //         {
  //           lockedUntil: season2Unlock.getTime(),
  //           tags: ['Referrer'],
  //         }
  //       ),
  //     });
  //   }
  // }

  if (assets.length === 0) return [];
  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Rewards',
      networkId: NetworkId.solana,
      platformId,
      name: 'Season 1',
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-rewards-s1`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
