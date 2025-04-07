import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { RenzoContractConfig, RenzoStakedContractConfig } from './types';
import { getEvmClient } from '../../utils/clients';
import {
  activeStakeAbi,
  getOutstandingWithdrawRequestsAbi,
  withdrawRequestAbi,
} from './abis';
import { Address } from 'viem';

export async function generateActiveStakeElement(
  activeStakeContract: RenzoStakedContractConfig,
  owner: Address,
  networkId: EvmNetworkIdType
): Promise<bigint | undefined> {
  const { address } = activeStakeContract;

  const client = getEvmClient(networkId);
  const activeStake = await client.readContract({
    address,
    abi: activeStakeAbi,
    functionName: 'activeStake',
    args: [owner],
  });

  return activeStake;
}

export async function generateDepositElement(
  depositContract: RenzoContractConfig,
  owner: Address,
  networkId: EvmNetworkIdType
): Promise<Array<{ token: Address; balance: bigint }>> {
  const { address } = depositContract;
  const client = getEvmClient(networkId);

  const numOfRequests = await client.readContract({
    address,
    abi: getOutstandingWithdrawRequestsAbi,
    functionName: 'getOutstandingWithdrawRequests',
    args: [owner],
  });

  if (!numOfRequests || numOfRequests === BigInt(0)) return [];

  const withdrawRequestsAnswers = await client.multicall({
    contracts: Array.from({ length: Number(numOfRequests) }, (_, index) => ({
      address: address,
      abi: withdrawRequestAbi,
      functionName: 'withdrawRequests',
      args: [owner, BigInt(index)],
    })),
  });

  return withdrawRequestsAnswers
    .filter((req) => req.status === 'success' && req.result)
    .map((req) => {
      const token = req.result?.[0];
      const balance = req.result?.[2];

      if (!token || !balance) return null;

      return { token, balance };
    })
    .filter((item) => item !== null);
}
