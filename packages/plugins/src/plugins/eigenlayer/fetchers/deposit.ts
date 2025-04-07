import { ethereumNativeAddress } from '@sonarwatch/portfolio-core';
import { Address, getAddress } from 'viem';

import { getEvmClient } from '../../../utils/clients';
import { Cache } from '../../../Cache';

import { chain, eigenPodManagerAddress, platformId } from '../constants';
import { abi } from '../abi';

import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

/**
 * Returns the deposit positions for a given owner
 * @param owner - The address of the owner
 * @param cache - The cache instance
 * @returns The deposit positions
 */
export const getDepositPositions = async (owner: Address, cache: Cache) => {
  const client = getEvmClient(chain);
  const podManagerAddress = getAddress(eigenPodManagerAddress);

  const podUserAddress = await client.readContract({
    address: podManagerAddress,
    abi: [abi.ownerToPod],
    functionName: abi.ownerToPod.name,
    args: [owner],
  });

  // If the user has no pod, the contract returns the ethereum native address address
  if (!podUserAddress || podUserAddress === ethereumNativeAddress) return [];

  // Get the balance of the pod user contract
  const balance = await client.getBalance({
    address: podUserAddress,
  });

  const elementRegistry = new ElementRegistry(chain, platformId);

  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: `Proxy Balance ${podUserAddress}`,
    tags: ['Deposit'],
  });

  element.addAsset({
    address: ethereumNativeAddress,
    amount: balance.toString(),
  });

  return elementRegistry.getElements(cache);
};
