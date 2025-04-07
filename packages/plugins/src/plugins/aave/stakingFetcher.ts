import { NetworkId } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import { Cache } from '../../Cache';
import { aave2PlatformId, stakingConfigs } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getBalancesAndTotalRewards } from './helpers';

const ETHEREUM_NETWORK_ID = NetworkId.ethereum;
const PLATFORM_ID = aave2PlatformId;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const balances = await getBalancesAndTotalRewards(
    getAddress(owner),
    stakingConfigs.map((config) => config.stakingTokenAddress),
    ETHEREUM_NETWORK_ID
  );

  const registry = new ElementRegistry(NetworkId.ethereum, PLATFORM_ID);

  stakingConfigs.forEach((config, index) => {
    const stakeBalanceIndex = index * 2;
    const rewardBalanceIndex = stakeBalanceIndex + 1;

    registry
      // overrides platformId for different aave platforms
      .addElementMultiple({
        label: 'Staked',
        name: config.name,
        platformId: config.platformId,
      })
      .addAsset({
        address: config.stakedAssetAddress,
        amount: balances.at(stakeBalanceIndex)?.toString() ?? '0',
      });

    registry
      .addElementMultiple({
        label: 'Rewards',
        name: config.name,
        platformId: config.platformId,
      })
      .addAsset({
        address: config.rewardAssetAddress,
        amount: balances.at(rewardBalanceIndex)?.toString() ?? '0',
      });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  // We're hard-coding `aave` here to abstract our internal use of `v2` vs `v3`
  id: `aave-staking`,
  networkId: ETHEREUM_NETWORK_ID,
  executor,
};

export default fetcher;
