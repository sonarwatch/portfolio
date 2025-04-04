import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
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

    const rewardCalls = siloIncentiveControllerAddresses.flatMap(
      (controller) => [
        {
          address: controller,
          abi: rewardAbi,
          functionName: 'getRewardsBalance',
          args: [rewardVaultAddresses, owner as `0x${string}`],
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

    await Promise.all(
      siloIncentiveControllerAddresses.map(async (_, i) => {
        const balanceRes = balanceResults[i];
        const tokenRes = tokenResults[i];

        elementRegistry
          .addElementMultiple({
            label: 'Rewards',
          })
          .addAsset({
            address: tokenRes.result as `0x${string}`,
            amount: balanceRes?.result?.toString() ?? 0,
          });
      })
    );

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${platformId}-${networkId}-rewards`,
    networkId,
    executor,
  };
}

export default fetcher;
