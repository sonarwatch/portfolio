import { Fetcher, FetcherExecutor } from '../../Fetcher';

import { platformId } from './constants';
import { Cache } from '../../Cache';
import { RenzoNetworkConfig } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import {
  fetchActiveStakeAndOutstandingWithdrawRequests,
  fetchWithdrawRequests,
  fetchStakedBalances,
} from './helpers';
import { Address, getAddress } from 'viem';

export function getPositionsFetcher(config: RenzoNetworkConfig): Fetcher {
  const { networkId, stakedContracts, activeStakeContract, depositContract } =
    config;

  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const ownerAddress = getAddress(owner);

    const registry = new ElementRegistry(networkId, platformId);

    const contractsWithBalances = await fetchStakedBalances(
      stakedContracts,
      ownerAddress,
      networkId
    );

    for (const { contract, balance } of contractsWithBalances) {
      registry
        .addElementMultiple({
          label: 'Staked',
          name: contract.assetName,
          tags: ['Staked'],
        })
        .addAsset({
          address: contract.token,
          amount: balance!.toString(),
        });
    }

    const [activeStake, numOfWithdrawRequests] =
      await fetchActiveStakeAndOutstandingWithdrawRequests(
        activeStakeContract.address,
        depositContract.address,
        ownerAddress,
        networkId
      );

    if (
      activeStake.status === 'success' &&
      activeStake.result &&
      activeStake.result !== BigInt(0)
    ) {
      registry
        .addElementMultiple({
          label: 'Staked',
          name: activeStakeContract.assetName,
          tags: ['Staked'],
        })
        .addAsset({
          address: activeStakeContract.token,
          amount: activeStake.result.toString(),
        });
    }

    let depositPositions: Array<{ token: Address; balance: bigint }> = [];

    if (
      numOfWithdrawRequests.status === 'success' &&
      numOfWithdrawRequests.result &&
      numOfWithdrawRequests.result !== BigInt(0)
    ) {
      depositPositions = await fetchWithdrawRequests(
        depositContract.address,
        ownerAddress,
        numOfWithdrawRequests.result,
        networkId
      );
    }

    for (const { token, balance } of depositPositions) {
      registry
        .addElementMultiple({
          label: 'Deposit',
          name: depositContract.assetName,
          tags: ['Deposit'],
        })
        .addAsset({
          address: token,
          amount: balance.toString(),
        });
    }

    return registry.getElements(cache);
  };

  return {
    id: `${platformId}-${networkId}`,
    networkId,
    executor,
  };
}
