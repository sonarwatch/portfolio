import { Fetcher, FetcherExecutor } from '../../Fetcher';

import { platformId } from './constants';
import { Cache } from '../../Cache';
import { getBalances } from '../../utils/evm/getBalances';
import { RenzoNetworkConfig } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { generateActiveStakeElement, generateDepositElement } from './helpers';

export function getPositionsFetcher(config: RenzoNetworkConfig): Fetcher {
  const { networkId, stakedContracts, activeStakeContract, depositContract } =
    config;

  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    if (!owner) return [];

    const registry = new ElementRegistry(networkId, platformId);

    const contractAddresses = stakedContracts.map(
      (contract) => contract.address
    );

    const balances = await getBalances(owner, contractAddresses, networkId);

    const contractsWithBalances = stakedContracts
      .map((contract, index) => ({ contract, balance: balances[index] }))
      .filter((item) => item.balance && item.balance !== BigInt(0));

    for (const { contract, balance } of contractsWithBalances) {
      registry.addElementMultiple({ label: 'Staked' }).addAsset({
        address: contract.token,
        amount: balance!.toString(),
      });
    }

    const activeStake = await generateActiveStakeElement(
      activeStakeContract,
      owner,
      networkId
    );

    if (activeStake && activeStake !== BigInt(0)) {
      registry.addElementMultiple({ label: 'Staked' }).addAsset({
        address: activeStakeContract.token,
        amount: activeStake.toString(),
      });
    }

    const depositPositions = await generateDepositElement(
      depositContract,
      owner,
      networkId
    );

    for (const { token, balance } of depositPositions) {
      registry.addElementMultiple({ label: 'Deposit' }).addAsset({
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
