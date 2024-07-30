import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  externalRewardsEndpoint,
  merkleProgramId,
  pid,
  platformId,
  rewardsEndpoint,
  slndMint,
} from './constants';
import { ExternalReward, Obligation } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { ClaimStatus, claimStatusStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const obligationAddress = await PublicKey.createWithSeed(
    new PublicKey(owner),
    '4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtf',
    pid
  );

  const [rewardsRes, externalRewardsRes] = await Promise.all([
    axios.get<Obligation[]>(rewardsEndpoint + obligationAddress.toString()),
    axios.get<ExternalReward[]>(externalRewardsEndpoint + owner),
  ]);
  const [rewards, externalRewards] = [rewardsRes.data, externalRewardsRes.data];

  const slndRewards = rewards.filter(
    (reward) =>
      reward.incentivizer === 'slnd_points' &&
      reward.quantity &&
      reward.quantity !== '0'
  );

  const claimAndBumps = slndRewards.map(
    (d) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('ClaimStatus', 'utf8'),
          new BN.BN(d.index).toArrayLike(Buffer, 'le', 8),
          new PublicKey(d.distributorPublicKey).toBytes(),
        ],
        new PublicKey(merkleProgramId)
      )[0]
  );

  const tokenMints = [
    slndMint,
    externalRewards.map((externalReward) =>
      externalReward.score && externalReward.score !== '0'
        ? externalReward.rewardMint
        : null
    ),
  ]
    .flat()
    .filter((m) => m !== null) as string[];

  if (tokenMints.length === 0) return [];

  const [tokenPrices, claimStatuses] = await Promise.all([
    cache.getTokenPricesAsMap(tokenMints, NetworkId.solana),
    getParsedMultipleAccountsInfo<ClaimStatus>(
      client,
      claimStatusStruct,
      claimAndBumps
    ),
  ]);

  const assets: PortfolioAsset[] = [];

  slndRewards.forEach((reward, i) => {
    const tokenPrice = tokenPrices.get(slndMint);
    if (!tokenPrice) return;
    const claimStatus = claimStatuses[i];
    if (!claimStatus || claimStatus.isClaimed) return;
    assets.push({
      ...tokenPriceToAssetToken(
        tokenPrice.address,
        new BigNumber(reward.quantity)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.solana,
        tokenPrice
      ),
      attributes: { isClaimable: true },
    });
  });

  externalRewards.forEach((externalReward) => {
    if (!externalReward.score || externalReward.score === '0') return;
    const tokenPrice = tokenPrices.get(externalReward.rewardMint);
    if (!tokenPrice) return;
    assets.push({
      ...tokenPriceToAssetToken(
        tokenPrice.address,
        new BigNumber(externalReward.score).dividedBy(10 ** 36).toNumber(),
        NetworkId.solana,
        tokenPrice
      ),
      attributes: { isClaimable: true },
    });
  });

  if (assets.length === 0) return [];

  const element: PortfolioElementMultiple = {
    networkId: NetworkId.solana,
    label: 'Rewards',
    platformId,
    type: PortfolioElementType.multiple,
    value: getUsdValueSum(assets.map((a) => a.value)),
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-rewards`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
