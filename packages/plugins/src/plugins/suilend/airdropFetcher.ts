import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  // airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  airdropStatics,
  marketsKey,
  obligationOwnerCapType,
  packageId,
  platform,
  platformId,
  mSendMint,
  suilendPointsType,
  mSendCoinType,
} from './constants';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import {
  SuilendCapsule,
  LendingMarket,
  MarketsInfo,
  Obligation,
  ObligationCapFields,
  BurnEvents,
} from './types';
import { getClientSui } from '../../utils/clients';
import { Cache } from '../../Cache';
import { getPoolsRewardsMaps } from './helpers';
import { wadsDecimal } from '../save/constants';
import earlyUsers from './earlyUsers.json';
import bluefinLeagues from './bluefinLeagues.json';
import { getKiosksDynamicFieldsObjects } from '../../utils/sui/getKioskObjects';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';
import { SuiClient } from '../../utils/clients/types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';

const memoizedBurnEvents = new MemoizedCache<BurnEvents>('burnEvents', {
  prefix: platformId,
  networkId: NetworkId.sui,
});

const eligibleCollections: Map<string, number> = new Map([
  [
    '0x8f74a7d632191e29956df3843404f22d27bd84d92cca1b1abde621d033098769::rootlet::Rootlet',
    333,
  ],
  [
    '0x034c162f6b594cb5a1805264dd01ca5d80ce3eca6522e6ee37fd9ebfb9d3ddca::factory::PrimeMachin',
    30,
  ],
  [
    '0x484932c474bf09f002b82e4a57206a6658a0ca6dbdb15896808dcd1929c77820::egg::AfEgg',
    10.4,
  ],
  [
    '0x57191e5e5c41166b90a4b7811ad3ec7963708aa537a8438c1761a5d33e2155fd::kumo::Kumo',
    22.5,
  ],
  [
    '0x862810efecf0296db2e9df3e075a7af8034ba374e73ff1098e88cc4bb7c15437::doubleup_citizens::DoubleUpCitizen',
    17.3,
  ],
]);

const capsuleType =
  '0x008a7e85138643db888096f2db04766d549ca496583e41c3a683c6e1539a64ac::suilend_capsule::SuilendCapsule';

const executor: AirdropFetcherExecutor = async (
  owner: string,
  cache: Cache
) => {
  const client = getClientSui();

  const { capsuleRecord, pointsRecord } = await memoizedBurnEvents.getItem(
    cache
  );

  const capsuleAmountClaimed = capsuleRecord[owner];
  const pointsAmountClaimed = pointsRecord[owner];

  const [pointsAllocation, nftsAllocation] = await Promise.all([
    getPointsAllocationItem(owner, client, cache),
    getNftsAllocationItems(owner, client),
  ]);

  // This is because we are not able to compute the EXACT number of mSEND for the classic allocation
  // So we expect that 95% of claimed or higher means it's claimed
  const isPointsAllocClaimed = BigNumber(pointsAmountClaimed)
    .dividedBy(pointsAllocation)
    .isGreaterThan(0.95);
  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: pointsAmountClaimed ?? pointsAllocation,
        isClaimed: isPointsAllocClaimed,
        label: 'mSEND',
        address: mSendMint,
        imageUri: platform.image,
      },
      {
        amount: nftsAllocation.collectionsAllocation,
        isClaimed:
          nftsAllocation.collectionsClaimed ===
          nftsAllocation.collectionsAllocation,
        label: 'mSEND',
        address: mSendMint,
        imageUri: platform.image,
      },
      {
        amount: capsuleAmountClaimed ?? nftsAllocation.capsulesAllocation,
        isClaimed: capsuleAmountClaimed === nftsAllocation.capsulesAllocation,
        label: 'mSEND',
        address: mSendMint,
        imageUri: platform.image,
      },
      {
        amount: getEarlyUserAllocation(owner),
        // Those were airdropped directly inside the wallet
        isClaimed: true,
        label: 'mSEND',
        address: mSendMint,
        imageUri: platform.image,
      },
      {
        amount: getBluefinLeagueAllocation(owner),
        // Those were airdropped directly inside the wallet
        isClaimed: true,
        label: 'mSEND',
        address: mSendMint,
        imageUri: platform.image,
      },
    ],
  });
};
export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.sui,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platform.id,
  'suilend-airdrop',
  airdropStatics.claimEnd
);

function getEarlyUserAllocation(owner: string): number {
  if (earlyUsers.includes(owner)) return 512;
  return 0;
}

function getBluefinLeagueAllocation(owner: string): number {
  return bluefinLeagues.includes(owner) ? 6.08 : 0;
}

async function getNftsAllocationItems(
  owner: string,
  client: SuiClient
): Promise<{
  capsulesAllocation: number;
  collectionsAllocation: number;
  collectionsClaimed: number;
}> {
  const eligibleCollectionsTypes = Array.from(eligibleCollections.keys());
  const objects = await getOwnedObjectsPreloaded(client, owner);
  const kioskObjects = (await getKiosksDynamicFieldsObjects(objects)).flat();

  const elligibleNfts: string[] = [];
  const collectionsAllocations: number[] = [];
  let capsulesAllocation = 0;
  [...objects, ...kioskObjects].forEach((obj) => {
    if (obj.data?.content) {
      if (eligibleCollectionsTypes.includes(obj.data.content.type)) {
        const nftAlloc = eligibleCollections.get(obj.data.content.type);
        if (nftAlloc) {
          elligibleNfts.push(obj.data.objectId);
          collectionsAllocations.push(nftAlloc);
        }
      } else if (obj.data.content.type === capsuleType) {
        const capsule = obj.data.content.fields as SuilendCapsule;
        if (capsule.rarity === 'rare') capsulesAllocation += 2000;
        if (capsule.rarity === 'common') capsulesAllocation += 500;
        if (capsule.rarity === 'uncommon') capsulesAllocation += 142;
      }
    }
  });

  let totalAlloc = 0;
  let totalClaimed = 0;
  const nftsObjects = await Promise.all([
    ...elligibleNfts.map((obj) =>
      getOwnedObjects(client, obj, {
        filter: {
          StructType: mSendCoinType,
        },
      })
    ),
  ]);

  for (let i = 0; i < elligibleNfts.length; i += 1) {
    const claimed = nftsObjects[i];
    const alloc = collectionsAllocations[i];
    if (claimed.length === 0) {
      totalClaimed += alloc;
    }
    totalAlloc += alloc;
  }

  return {
    collectionsAllocation: totalAlloc,
    capsulesAllocation,
    collectionsClaimed: totalClaimed,
  };
}

async function getPointsAllocationItem(
  owner: string,
  client: SuiClient,
  cache: Cache
): Promise<number> {
  const obligationsCapFields =
    await getOwnedObjectsPreloaded<ObligationCapFields>(client, owner, {
      filter: { Package: packageId },
    });
  if (obligationsCapFields.length === 0) return 0;

  const obligationsId: string[] = [];
  for (const obligationCapField of obligationsCapFields) {
    const type = obligationCapField.data?.content?.type;
    if (!type?.startsWith(obligationOwnerCapType)) continue;

    const obligationId = obligationCapField.data?.content?.fields.obligation_id;
    if (obligationId) obligationsId.push(obligationId);
  }

  const obligations = await multiGetObjects<Obligation>(client, obligationsId);
  if (obligations.length === 0) return 0;

  const marketsInfo = await cache.getItem<MarketsInfo>(marketsKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
  const lendingMarkets = marketsInfo?.lendingMarkets;
  const marketsByIndex: Map<string, LendingMarket> = new Map();
  if (lendingMarkets)
    marketsInfo.lendingMarkets.forEach((market) => {
      marketsByIndex.set(market.id.id, market);
    });
  const [poolRewardById] = getPoolsRewardsMaps(lendingMarkets);

  let suilendPoints = new BigNumber(0);
  for (const obligation of obligations) {
    const { data } = obligation;
    if (!data || !data.content) continue;

    const market = marketsByIndex.get(data.content.fields.lending_market_id);
    if (!market) continue;

    const { user_reward_managers: userRewardManagers } = data.content.fields;
    for (const userRewardManager of userRewardManagers) {
      for (const userReward of userRewardManager.fields.rewards) {
        if (!userReward) continue;

        const poolReward = poolRewardById.get(userReward.fields.pool_reward_id);
        if (
          !poolReward ||
          poolReward.coin_type.fields.name !== suilendPointsType
        )
          continue;

        suilendPoints = suilendPoints.plus(
          BigNumber(userReward.fields.earned_rewards.fields.value).dividedBy(
            10 ** wadsDecimal
          )
        );
      }
    }
  }

  return suilendPoints
    .dividedBy(10 ** 6)
    .dividedBy(1000)
    .times(7.16) // SEND per 1k
    .toNumber();
}
