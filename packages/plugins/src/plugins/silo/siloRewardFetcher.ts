import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { Address, getAddress } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import {
  PLATFORM_ID,
  SILOS_INCENTIVE_CONTROLLER_ADDRESSES,
  REWARD_VAULT_ADDRESSES,
} from './constants';
import { rewardAbi, rewardTokenAbi } from './abis';
import { Cache } from '../../Cache';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

function fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const ownerAddress = getAddress(owner);
    const rewardCalls = SILOS_INCENTIVE_CONTROLLER_ADDRESSES.flatMap(
      (controller) => [
        {
          address: controller,
          abi: rewardAbi,
          functionName: 'getRewardsBalance',
          args: [REWARD_VAULT_ADDRESSES, ownerAddress],
        } as const,
        {
          address: controller,
          abi: rewardTokenAbi,
          functionName: 'REWARD_TOKEN',
        } as const,
      ]
    );

    const rewardsResults = await client.multicall({
      contracts: rewardCalls,
    });

    const balanceResults = rewardsResults.filter((_, i) => i % 2 === 0);
    const tokenResults = rewardsResults.filter((_, i) => i % 2 === 1);

    const elementRegistry = new ElementRegistry(networkId, PLATFORM_ID);

    for (let i = 0; i < SILOS_INCENTIVE_CONTROLLER_ADDRESSES.length; i++) {
      const balance = balanceResults[i]?.result?.toString();
      const token = tokenResults[i].result as Address;

      if (!balance || balance === '0') continue;

      elementRegistry
        .addElementMultiple({
          label: 'Rewards',
        })
        .addAsset({
          address: token,
          amount: balance,
        });
    }

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${PLATFORM_ID}-${networkId}-rewards`,
    networkId,
    executor,
  };
}

export default fetcher;
