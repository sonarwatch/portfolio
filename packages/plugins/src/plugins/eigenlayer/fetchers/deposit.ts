import {
  ethereumNativeAddress,
  ethereumNetwork,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Address, getAddress } from 'viem';

import { getEvmClient } from '../../../utils/clients';
import { Cache } from '../../../Cache';

import { chain, eigenPodManagerAddress, platformId } from '../constants';
import { abi } from '../abi';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { convertBigIntToNumber } from '../../../utils/octav/tokenFactor';

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

  const assets: PortfolioAsset[] = [];
  const tokenPrice = await cache.getTokenPrice(ethereumNativeAddress, chain);
  const asset = tokenPriceToAssetToken(
    ethereumNativeAddress,
    convertBigIntToNumber(balance, ethereumNetwork.native.decimals),
    chain,
    tokenPrice
  );
  assets.push(asset);

  const element: PortfolioElement = {
    networkId: chain,
    name: `Proxy Balance ${podUserAddress}`,
    platformId,
    label: 'Deposit',
    type: PortfolioElementType.multiple,
    value: asset.value,
    data: {
      assets,
    },
  };
  return [element];
};
