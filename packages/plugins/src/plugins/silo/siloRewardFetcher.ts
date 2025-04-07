import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { Address, getAddress } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import {
  platformId,
  siloIncentiveControllerAddresses,
  rewardVaultAddresses,
} from './constants';
import { rewardAbi, rewardTokenAbi } from './abis';
import { Cache } from '../../Cache';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

function fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const ownerAddress = getAddress(owner);
    const rewardCalls = siloIncentiveControllerAddresses.flatMap(
      (controller) => [
        {
          address: controller,
          abi: rewardAbi,
          functionName: 'getRewardsBalance',
          args: [rewardVaultAddresses, ownerAddress],
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

    const elementRegistry = new ElementRegistry(networkId, platformId);

    for (let i = 0; i < siloIncentiveControllerAddresses.length; i++) {
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
    id: `${platformId}-${networkId}-rewards`,
    networkId,
    executor,
  };
}

export default fetcher;
