import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  getUsdValueSum,
  nativeStakePlatformId,
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { EpochInfo } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { validatorsKey } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { stakeAccountsFilter } from './filters';
import { stakeAccountStruct } from './structs';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { platformId as marinadePlatformId } from '../../marinade/constants';
import { platformId as jitoPlatformId } from '../../jito/constants';
import {
  epochInfoCacheKey,
  marinadeManagerAddresses,
  stakeProgramId,
} from './constants';
import { MemoizedCache } from '../../../utils/misc/MemoizedCache';
import { Validator } from './types';
import { arrayToMap } from '../../../utils/misc/arrayToMap';

const validatorsMemo = new MemoizedCache<Validator[], Map<string, Validator>>(
  validatorsKey,
  {
    prefix: nativeStakePlatformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'voter')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const filters = stakeAccountsFilter(owner.toString());

  const stakeAccounts = await getParsedProgramAccounts(
    client,
    stakeAccountStruct,
    stakeProgramId,
    filters
  );
  if (stakeAccounts.length === 0) return [];

  const [solTokenPrice, epochInfo, validators] = await Promise.all([
    cache.getTokenPrice(solanaNetwork.native.address, NetworkId.solana),
    cache.getItem<EpochInfo>(epochInfoCacheKey, {
      prefix: nativeStakePlatformId,
      networkId: NetworkId.solana,
    }),
    validatorsMemo.getItem(cache),
  ]);

  const epoch = epochInfo?.epoch;
  let marinadeSolAmount = 0;
  let solAmount = 0;
  let nMarinadeAccounts = 0;
  let mevRewards = 0;
  let nativeAssets: PortfolioAsset[] = [];
  for (let i = 0; i < stakeAccounts.length; i += 1) {
    const stakeAccount = stakeAccounts[i];
    const validator = validators.get(stakeAccount.voter.toString());
    const { deactivationEpoch, activationEpoch, staker } = stakeAccount;

    const isMarinade = marinadeManagerAddresses.includes(staker.toString());

    let accountMevRewards = new BigNumber(0);
    if (!activationEpoch.isZero() && !isMarinade) {
      accountMevRewards = new BigNumber(stakeAccount.lamports)
        .minus(stakeAccount.rentExemptReserve)
        .minus(stakeAccount.stake);
      mevRewards += accountMevRewards.dividedBy(10 ** 9).toNumber();
    }

    const amount = new BigNumber(stakeAccount.lamports)
      .minus(stakeAccount.rentExemptReserve)
      .minus(accountMevRewards)
      .dividedBy(10 ** 9)
      .toNumber();
    if (amount <= 0) continue;

    if (isMarinade) {
      marinadeSolAmount += amount;
      nMarinadeAccounts += 1;
      continue;
    } else solAmount += amount;

    // Status tags
    const tags = [];
    if (
      epoch &&
      activationEpoch.isEqualTo(epoch) &&
      deactivationEpoch.isEqualTo(epoch)
    ) {
      tags.push('Unstaked');
    } else if (epoch && activationEpoch.isGreaterThanOrEqualTo(epoch)) {
      tags.push('Activating');
    } else if (epoch && deactivationEpoch.isLessThan(epoch)) {
      tags.push('Inactive');
    } else if (epoch && deactivationEpoch.isEqualTo(epoch)) {
      tags.push('Unstaking');
    } else if (deactivationEpoch.isZero() && activationEpoch.isZero()) {
      tags.push('Initialized');
    } else {
      tags.push('Active');
    }

    const lockedUntil =
      stakeAccount.lockup.unixTimestamp.times(1000).toNumber() || undefined;

    nativeAssets.push({
      ...tokenPriceToAssetToken(
        solanaNetwork.native.address,
        amount,
        NetworkId.solana,
        solTokenPrice,
        undefined,
        {
          tags,
          lockedUntil,
        }
      ),
      ref: stakeAccount.pubkey.toString(),
      name: validator?.name,
      imageUri: validator?.imageUri,
    });
  }

  if (nativeAssets.length > 30) {
    nativeAssets = [
      tokenPriceToAssetToken(
        solanaNetwork.native.address,
        solAmount,
        NetworkId.solana,
        solTokenPrice
      ),
    ];
  }

  const elements: PortfolioElement[] = [];
  if (nativeAssets.length !== 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId: nativeStakePlatformId,
      type: 'multiple',
      label: 'Staked',
      value: getUsdValueSum(nativeAssets.map((a) => a.value)),
      data: {
        assets: nativeAssets,
      },
    });
  }
  if (nMarinadeAccounts !== 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId: marinadePlatformId,
      type: 'multiple',
      label: 'Staked',
      name: `Native (${nMarinadeAccounts} validators)`,
      value: solTokenPrice ? marinadeSolAmount * solTokenPrice.price : null,
      data: {
        assets: [
          {
            ...tokenPriceToAssetToken(
              solanaNetwork.native.address,
              marinadeSolAmount,
              NetworkId.solana,
              solTokenPrice
            ),
            attributes: {},
          },
        ],
      },
    });
  }
  if (mevRewards > 0) {
    elements.push({
      networkId: NetworkId.solana,
      platformId: jitoPlatformId,
      type: 'multiple',
      label: 'Rewards',
      name: `MEV Rewards`,
      value: solTokenPrice ? mevRewards * solTokenPrice.price : null,
      data: {
        assets: [
          {
            ...tokenPriceToAssetToken(
              solanaNetwork.native.address,
              mevRewards,
              NetworkId.solana,
              solTokenPrice
            ),
            attributes: { isClaimable: true },
          },
        ],
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${nativeStakePlatformId}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
