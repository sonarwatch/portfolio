import { Address, getAddress } from 'viem';
import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';

import { getEvmClient } from '../../utils/clients';
import { deepLog } from '../../utils/misc/logging';

const abi = {
  collateralContract: {
    stateMutability: 'view',
    type: 'function',
    name: 'collateralContract',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  assetAddress: {
    stateMutability: 'view',
    type: 'function',
    name: 'asset',
    inputs: [], // Add this line
    outputs: [{ name: '', type: 'address' }], // Add this line
  },
  getAllPairAddresses: {
    inputs: [],
    name: 'getAllPairAddresses',
    outputs: [
      {
        internalType: 'address[]',
        name: '_deployedPairsArray',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
} as const;

export type PoolToken = {
  chain: EvmNetworkIdType;
  address: `0x${string}`;
  borrowed: `0x${string}`;
  underlyings: string[];
};
export type PoolTokenOther = {
  chain: EvmNetworkIdType;
  pairAddress: `0x${string}`;
  borrowedAssetAddress: `0x${string}`;
  suppliedAssetAddress: `0x${string}`;
};

export async function getPairsContracts(
  networkId: EvmNetworkIdType,
  registry: string
) {
  const client = getEvmClient(networkId);

  const pairs = await client.readContract({
    address: getAddress(registry),
    abi: [abi.getAllPairAddresses],
    functionName: 'getAllPairAddresses',
  } as const);

  // Define the collateral contract calls for each pair
  const collateralCalls = pairs.map(
    (pair: string) =>
      ({
        address: getAddress(pair),
        abi: [abi.collateralContract],
        functionName: 'collateralContract',
        args: [],
      } as const)
  );

  const borrowedCalls = pairs.map(
    (pair: string) =>
      ({
        address: getAddress(pair),
        abi: [abi.assetAddress],
        functionName: 'asset',
      } as const)
  );

  // Fetch collateral contracts using Viewn multicall
  const collateralResponses = await client.multicall({
    contracts: collateralCalls,
  });

  // Fetch collateral contracts using Viewn multicall
  const borrowedResponses = await client.multicall({
    contracts: borrowedCalls,
  });

  // Process the responses to construct the contracts array
  const contracts = [];
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const collateralResponse = collateralResponses[i];
    const assetResponse = borrowedResponses[i];

    if (collateralResponse.status !== 'success') {
      continue;
    }

    const collateralContractAddress = collateralResponse.result as Address;
    const borrowedContractAddress = assetResponse.result as Address;

    const poolToken = {
      chain: networkId,
      pairAddress: pair,
      borrowedAssetAddress: borrowedContractAddress,
      suppliedAssetAddress: collateralContractAddress,
    };

    contracts.push(poolToken);
  }
  console.log(deepLog(contracts));
  return contracts;
}
const executor: JobExecutor = async () => {
  const fraxtalRegistry = '0x4C3B0e85CD8C12E049E07D9a4d68C441196E6a12'; // Replace with your Fraxtal registry address
  await getPairsContracts(NetworkId.fraxtal, fraxtalRegistry);
};

const job: Job = {
  id: `${platformId}-fraxtal-pairs`,
  executor,
  label: 'normal',
};
export default job;
