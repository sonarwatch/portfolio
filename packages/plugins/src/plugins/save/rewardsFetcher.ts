import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  merkleProgramId,
  pid,
  platformId,
  rewardProofsEndpoint,
  rewardStatsKey,
  rewardStatsPrefix,
  slndMint,
} from './constants';
import { ClaimData, RewardStat, FullClaimDataType } from './types';
import {
  associatedTokenProgramId,
  getParsedMultipleAccountsInfo,
  solanaTokenPid,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import {
  ClaimStatus,
  claimStatusStruct,
  MerkleDistributor,
  merkleDistributorStruct,
} from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

/**
 * @deprecated
 * this fetcher has been deprecated because use of an external API
 */
const getClaimData = async (owner: string) => {
  const obligationAddress = await PublicKey.createWithSeed(
    new PublicKey(owner),
    '4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtf',
    pid
  );

  const rewardProofsRes = await axios.get<ClaimData[]>(
    rewardProofsEndpoint + obligationAddress.toString()
  );
  return rewardProofsRes.data.map((d) => ({
    ...d,
    distributorPublicKey: new PublicKey(d.distributorPublicKey),
  }));
};

const getRewardData = async (client: Connection, claimData: ClaimData[]) => {
  const claimAndBumps = claimData.map((d) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from('ClaimStatus', 'utf8'),
        new BN.BN.BN(d.index).toArrayLike(Buffer, 'le', 8),
        d.distributorPublicKey.toBytes(),
      ],
      new PublicKey(merkleProgramId)
    )
  );

  const [merkleDistributors, claimStatuses] = await Promise.all([
    getParsedMultipleAccountsInfo<MerkleDistributor>(
      client,
      merkleDistributorStruct,
      claimData.map((d) => d.distributorPublicKey)
    ),
    getParsedMultipleAccountsInfo<ClaimStatus>(
      client,
      claimStatusStruct,
      claimAndBumps.map((candb) => candb[0])
    ),
  ]);

  const fullData = (
    await Promise.all(
      claimData.map(async (d, index): Promise<FullClaimDataType | null> => {
        const merkleDistributor = merkleDistributors[index];
        const claimAndBump = claimAndBumps[index];
        const claimStatus = claimStatuses[index];
        if (!merkleDistributor || !claimAndBump) return null;

        const [distributorATAPublicKey] = PublicKey.findProgramAddressSync(
          [
            d.distributorPublicKey.toBuffer(),
            new PublicKey(solanaTokenPid).toBuffer(),
            merkleDistributor.mint.toBuffer(),
          ],
          associatedTokenProgramId
        );

        const accountFunded =
          (await client.getTokenAccountBalance(distributorATAPublicKey)).value
            .amount !== '0';

        return {
          ...d,
          accountFunded,
          claimId: claimAndBump[0],
          claimStatusBump: claimAndBump[1],
          claimed: Boolean(claimStatus?.isClaimed),
          claimedAt: claimStatus ? Number(claimStatus.claimedAt) : 0,
          distributor: merkleDistributor,
          distributorATAPublicKey,
        };
      })
    )
  ).filter((d) => d !== null) as FullClaimDataType[];

  const slndRewards = fullData.filter((d) =>
    ['slnd_options', 'slnd'].includes(d.incentivizer)
  );

  return {
    pythPointsRewards: fullData.filter((c) => c.incentivizer === 'pyth_points'),
    slndPointsRewards: fullData.filter((c) => c.incentivizer === 'slnd_points'),
    slnd: slndRewards,
    external: fullData
      .filter(
        (d) =>
          !['slnd_options', 'slnd', 'pyth_points', 'slnd_points'].includes(
            d.incentivizer
          )
      )
      .reduce((acc, currentValue) => {
        if (!acc[currentValue.distributor.mint.toString()]) {
          acc[currentValue.distributor.mint.toString()] = [];
        }
        acc[currentValue.distributor.mint.toString()].push(currentValue);
        return acc;
      }, {} as { [mint: string]: Array<FullClaimDataType> }),
  };
};

const getRewards = async (owner: string, cache: Cache) => {
  const claimData = await getClaimData(owner);
  if (claimData.length === 0) return [];

  const client = getClientSolana();

  const [rewardData, rewardStats] = await Promise.all([
    getRewardData(client, claimData),
    cache.getItem<RewardStat[]>(rewardStatsKey, {
      prefix: rewardStatsPrefix,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!rewardStats || rewardStats.length === 0) return [];

  const rewardsSummary = [
    ...new Set(rewardStats.map((rew) => rew.rewardMint)),
  ].map((rewardMint) => {
    const claims = rewardData?.external?.[rewardMint] ?? [];

    const unclaimed = claims.filter((cd) => !cd.claimed && cd.accountFunded);
    const totalUnclaimed = unclaimed.reduce(
      (sum, lot) => new BigNumber(lot.quantity).plus(sum),
      new BigNumber(0)
    );

    return {
      rewardMint,
      totalUnclaimed,
    };
  });

  const unclaimedSlnd = rewardData?.slnd
    .filter((cd) => cd.incentivizer === 'slnd' && !cd.claimed)
    .reduce(
      (sum, lot) => new BigNumber(lot.quantity).dividedBy(10 ** 6).plus(sum),
      new BigNumber(0)
    );

  rewardsSummary.push({
    rewardMint: slndMint,
    totalUnclaimed: unclaimedSlnd,
  });

  return rewardsSummary.filter((r) => r.totalUnclaimed.isGreaterThan(0));
};

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const rewards = await getRewards(owner, cache);

  if (rewards.length === 0) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    rewards.map((r) => r.rewardMint),
    NetworkId.solana
  );

  const assets: PortfolioAsset[] = [];

  rewards.forEach((reward) => {
    const tokenPrice = tokenPrices.get(reward.rewardMint);
    if (!tokenPrice) return;
    assets.push({
      ...tokenPriceToAssetToken(
        tokenPrice.address,
        reward.totalUnclaimed.dividedBy(10 ** tokenPrice.decimals).toNumber(),
        NetworkId.solana,
        tokenPrice
      ),
      attributes: { isClaimable: true },
    });
  });

  if (assets.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      label: 'Rewards',
      platformId,
      type: PortfolioElementType.multiple,
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: {
        assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-rewards`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
