import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { Address, getAddress } from 'viem';
import { logger } from '@nx/devkit';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import {
  PLATFORM_ID,
  SILOS_INCENTIVE_CONTROLLER_ADDRESSES,
  SILOS_REWARD_VAULTS_KEY,
} from './constants';
import { rewardAbi, rewardTokenAbi } from './abis';
import { Cache } from '../../Cache';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

function fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    // Get reward vault addresses from cache
    const rewardVaultAddresses = await cache.getItem<Address[]>(
      SILOS_REWARD_VAULTS_KEY,
      {
        prefix: PLATFORM_ID,
        networkId,
      }
    );

    if (!rewardVaultAddresses || rewardVaultAddresses.length === 0) {
      logger.error(`No reward vault addresses found for ${networkId}`);
      return [];
    }

    // The call doesn't work with 350 addresses
    const batchSize = 300;
    const numberOfBatches = Math.ceil(rewardVaultAddresses.length / batchSize);

    const client = getEvmClient(networkId);
    const ownerAddress = getAddress(owner);

    // Calls structure: [token_c0, balance_c0_b0, ..., balance_c0_bN, token_c1, ...]
    const rewardCalls = SILOS_INCENTIVE_CONTROLLER_ADDRESSES.flatMap(
      (controller) => [
        {
          address: controller,
          abi: rewardTokenAbi,
          functionName: 'REWARD_TOKEN',
        } as const,
        ...Array(numberOfBatches)
          .fill(0)
          .map(
            (_, batch) =>
              ({
                address: controller,
                abi: rewardAbi,
                functionName: 'getRewardsBalance',
                args: [
                  rewardVaultAddresses.slice(
                    batch * batchSize,
                    (batch + 1) * batchSize
                  ),
                  ownerAddress,
                ],
              } as const)
          ),
      ]
    );

    // Get the single results array
    const results = await client.multicall({
      contracts: [...rewardCalls],
      allowFailure: true,
    });

    const elementRegistry = new ElementRegistry(networkId, PLATFORM_ID);

    const callsPerController = 1 + numberOfBatches; // 1 token call + N balance calls

    for (let i = 0; i < SILOS_INCENTIVE_CONTROLLER_ADDRESSES.length; i++) {
      const tokenIndex = i * callsPerController;
      // Calculate index for the *first* balance result for this controller
      const firstBalanceIndex = tokenIndex + 1;

      if (
        results[tokenIndex].status !== 'success' ||
        results[firstBalanceIndex].status !== 'success'
      ) {
        continue;
      }

      // Get the token result
      const token = results[tokenIndex].result as Address;
      // Get the *first* balance result for this controller
      const balance = results[firstBalanceIndex].result!.toString();

      if (!balance || balance === '0') {
        continue;
      }

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
