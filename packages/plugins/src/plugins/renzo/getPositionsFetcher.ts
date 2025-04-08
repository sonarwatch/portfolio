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
import { getAddress } from 'viem';
import { zeroBigInt } from '../../utils/misc/constants';

export function getPositionsFetcher(config: RenzoNetworkConfig): Fetcher {
  const { networkId, stakedContracts, activeStakeContract, depositContract } =
    config;

  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const ownerAddress = getAddress(owner);

    const registry = new ElementRegistry(networkId, platformId);

    const [contractsWithBalances, [activeStake, numOfWithdrawRequests]] =
      await Promise.all([
        fetchStakedBalances(stakedContracts, ownerAddress, networkId),
        fetchActiveStakeAndOutstandingWithdrawRequests(
          activeStakeContract.address,
          depositContract.address,
          ownerAddress,
          networkId
        ),
      ]);

    for (const { contract, balance } of contractsWithBalances) {
      if (balance === null) continue;
      registry
        .addElementMultiple({
          label: 'Staked',
          name: contract.assetName,
          tags: ['Staked'],
        })
        .addAsset({
          address: contract.token,
          amount: balance.toString(),
        });
    }

    if (
      activeStake.status === 'success' &&
      activeStake.result &&
      activeStake.result !== zeroBigInt
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

    if (
      numOfWithdrawRequests.status === 'failure' ||
      !numOfWithdrawRequests.result ||
      numOfWithdrawRequests.result === zeroBigInt
    )
      return registry.getElements(cache);

    const depositPositions = await fetchWithdrawRequests(
      depositContract.address,
      ownerAddress,
      numOfWithdrawRequests.result,
      networkId
    );

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
    id: `${platformId}-${networkId}-positions`,
    networkId,
    executor,
  };
}
