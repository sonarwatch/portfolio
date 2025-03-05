import { Address, getAddress } from 'viem';
import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import {
  fraxtalPoolRegistry,
  pairAddressesCachePrefix,
  platformId,
} from './constants';

import { getEvmClient } from '../../utils/clients';
import { pairsAbi } from './abis';
import { Cache } from '../../Cache';

export type PoolTokenPairs = {
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
    abi: [pairsAbi.getAllPairAddresses],
    functionName: 'getAllPairAddresses',
  } as const);

  // get collateral token address for each pool
  const collateralCalls = pairs.map(
    (pair: string) =>
      ({
        address: getAddress(pair),
        abi: [pairsAbi.collateralContract],
        functionName: 'collateralContract',
        args: [],
      } as const)
  );

  // get borrowed token address for each pool
  const borrowedCalls = pairs.map(
    (pair: string) =>
      ({
        address: getAddress(pair),
        abi: [pairsAbi.assetAddress],
        functionName: 'asset',
      } as const)
  );

  const collateralResponses = await client.multicall({
    contracts: collateralCalls,
  });

  const borrowedResponses = await client.multicall({
    contracts: borrowedCalls,
  });

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
  return contracts;
}
const executor: JobExecutor = async (cache: Cache) => {
  const networkId = NetworkId.fraxtal;

  const pairsContracts = await getPairsContracts(
    networkId,
    fraxtalPoolRegistry
  );

  await cache.setItem(pairAddressesCachePrefix, pairsContracts, {
    prefix: pairAddressesCachePrefix,
    networkId,
  });
};

const job: Job = {
  id: `${platformId}-fraxtal-pairs`,
  executor,
  label: 'normal',
};
export default job;
