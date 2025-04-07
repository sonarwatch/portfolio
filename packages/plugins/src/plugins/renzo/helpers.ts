import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { RenzoStakedContractConfig } from './types';
import { getEvmClient } from '../../utils/clients';
import {
  activeStakeAbi,
  getOutstandingWithdrawRequestsAbi,
  withdrawRequestAbi,
} from './abis';
import { Address } from 'viem';
import { getBalances } from '../../utils/evm/getBalances';
import { MulticallIO } from '../../utils/octav/types/multicallIO';
import { zeroBigInt } from '../../utils/misc/constants';

export type ActiveStakeIO = MulticallIO<typeof activeStakeAbi, 'activeStake'>;
export type OutstandingWithdrawRequestsIO = MulticallIO<
  typeof getOutstandingWithdrawRequestsAbi,
  'getOutstandingWithdrawRequests'
>;

export async function fetchStakedBalances(
  stakedContracts: RenzoStakedContractConfig[],
  owner: Address,
  networkId: EvmNetworkIdType
): Promise<
  {
    contract: RenzoStakedContractConfig;
    balance: bigint | null;
  }[]
> {
  const contractAddresses = stakedContracts.map((contract) => contract.address);
  const balances = await getBalances(owner, contractAddresses, networkId);

  return stakedContracts
    .map((contract, index) => ({ contract, balance: balances[index] }))
    .filter((item) => item.balance && item.balance !== zeroBigInt);
}

export async function fetchActiveStakeAndOutstandingWithdrawRequests(
  activeStakeContractAddress: Address,
  depositContractAddress: Address,
  owner: Address,
  networkId: EvmNetworkIdType
): Promise<[ActiveStakeIO['output'], OutstandingWithdrawRequestsIO['output']]> {
  const client = getEvmClient(networkId);

  const activeStakeInput: ActiveStakeIO['input'] = {
    address: activeStakeContractAddress,
    abi: activeStakeAbi,
    functionName: 'activeStake',
    args: [owner],
  };

  const withdrawRequestsInput: OutstandingWithdrawRequestsIO['input'] = {
    address: depositContractAddress,
    abi: getOutstandingWithdrawRequestsAbi,
    functionName: 'getOutstandingWithdrawRequests',
    args: [owner],
  };

  const multicallResults = await client.multicall({
    contracts: [activeStakeInput, withdrawRequestsInput],
  });

  return [multicallResults[0], multicallResults[1]];
}

export async function fetchWithdrawRequests(
  depositContractAddress: Address,
  owner: Address,
  numOfRequests: bigint,
  networkId: EvmNetworkIdType
): Promise<Array<{ token: Address; balance: bigint }>> {
  if (numOfRequests === zeroBigInt) return [];

  const client = getEvmClient(networkId);

  const withdrawRequestsAnswers = await client.multicall({
    contracts: Array.from({ length: Number(numOfRequests) }, (_, index) => ({
      address: depositContractAddress,
      abi: withdrawRequestAbi,
      functionName: 'withdrawRequests',
      args: [owner, BigInt(index)],
    })),
  });

  return withdrawRequestsAnswers
    .filter((req) => req.status === 'success' && req.result)
    .map((req) => {
      if (req.status !== 'success' || !req.result) return undefined;

      const token = req.result[0];
      const balance = req.result[2];

      if (!token || !balance) return undefined;

      return { token, balance };
    })
    .filter((item) => !!item);
}
