import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  getUsdValueSum,
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { EpochInfo } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { nativeStakePlatform, platformId } from '../constants';
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

  const solTokenPrice = await cache.getTokenPrice(
    solanaNetwork.native.address,
    NetworkId.solana
  );

  const epochInfo = await cache.getItem<EpochInfo>(epochInfoCacheKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  const epoch = epochInfo?.epoch;

  let marinadeSolAmount = 0;
  let solAmount = 0;
  let nMarinadeAccounts = 0;
  let mevRewards = 0;
  let nativeAssets: PortfolioAsset[] = [];
  for (let i = 0; i < stakeAccounts.length; i += 1) {
    const stakeAccount = stakeAccounts[i];

    mevRewards += new BigNumber(stakeAccount.lamports)
      .minus(stakeAccount.rentExemptReserve)
      .minus(stakeAccount.stake)
      .dividedBy(10 ** 9)
      .toNumber();

    const amount = new BigNumber(stakeAccount.stake)
      .minus(stakeAccount.rentExemptReserve)
      .dividedBy(new BigNumber(10 ** 9))
      .toNumber();
    if (amount <= 0) continue;

    const isMarinade = marinadeManagerAddresses.includes(
      stakeAccount.staker.toString()
    );
    if (isMarinade) {
      marinadeSolAmount += amount;
      nMarinadeAccounts += 1;
      continue;
    } else solAmount += amount;

    // Status tags
    const { deactivationEpoch, activationEpoch } = stakeAccount;
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
      tags.push('Unstaked');
    } else if (epoch && deactivationEpoch.isEqualTo(epoch)) {
      tags.push('Unstaking');
    } else {
      tags.push('Active');
    }

    nativeAssets.push({
      ...tokenPriceToAssetToken(
        solanaNetwork.native.address,
        amount,
        NetworkId.solana,
        solTokenPrice,
        undefined,
        {
          tags,
        }
      ),
    });
  }

  if (nativeAssets.length > 20) {
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
      platformId: nativeStakePlatform.id,
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
  id: `${platformId}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
