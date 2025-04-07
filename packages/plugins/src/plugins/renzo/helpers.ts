import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { RenzoContractConfig, RenzoStakedContractConfig } from './types';
import { getEvmClient } from '../../utils/clients';
import {
  activeStakeAbi,
  getOutstandingWithdrawRequestsAbi,
  withdrawRequestAbi,
} from './abis';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Address } from 'viem';

export function generateStakedElements(
  stakedContracts: RenzoStakedContractConfig[],
  balances: (bigint | null)[],
  registry: ElementRegistry
): void {
  const contractsWithBalances = stakedContracts
    .map((contract, index) => ({ contract, balance: balances[index] }))
    .filter((item) => item.balance && item.balance !== BigInt(0));

  for (const { contract, balance } of contractsWithBalances) {
    registry.addElementMultiple({ label: 'Staked' }).addAsset({
      address: contract.token,
      amount: balance!.toString(),
    });
  }
}

export async function generateActiveStakeElement(
  activeStakeContract: RenzoStakedContractConfig,
  owner: string,
  networkId: EvmNetworkIdType,
  registry: ElementRegistry
): Promise<void> {
  const { address, token } = activeStakeContract;

  const client = getEvmClient(networkId);
  const activeStake = await client.readContract({
    address,
    abi: activeStakeAbi,
    functionName: 'activeStake',
    args: [owner as Address],
  });

  if (!activeStake || activeStake === BigInt(0)) return;

  registry
    .addElementMultiple({ label: 'Staked' })
    .addAsset({ address: token, amount: activeStake.toString() });
}

export async function generateDepositElement(
  depositContract: RenzoContractConfig,
  owner: string,
  networkId: EvmNetworkIdType,
  registry: ElementRegistry
): Promise<void> {
  const { address } = depositContract;
  const client = getEvmClient(networkId);

  const numOfRequests = await client.readContract({
    address,
    abi: getOutstandingWithdrawRequestsAbi,
    functionName: 'getOutstandingWithdrawRequests',
    args: [owner as Address],
  });

  if (!numOfRequests || numOfRequests === BigInt(0)) return;

  const withdrawRequestsAnswers = await client.multicall({
    contracts: Array.from({ length: Number(numOfRequests) }, (_, index) => ({
      address: address as Address,
      abi: withdrawRequestAbi,
      functionName: 'withdrawRequests',
      args: [owner as Address, BigInt(index)],
    })),
  });

  withdrawRequestsAnswers
    .filter((req) => req.status === 'success' && req.result)
    .forEach((req) => {
      const token = req.result?.[0];
      const balance = req.result?.[2];

      if (!token || !balance) return;

      registry
        .addElementMultiple({ label: 'Deposit' })
        .addAsset({ address: token, amount: balance.toString() });
    });
}
