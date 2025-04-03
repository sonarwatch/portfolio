import {
  ethereumNativeAddress,
  ethereumNativeDecimals,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../../../utils/clients';
import { Cache } from '../../../Cache';

import {
  eigenDelegationManagerAddress,
  eigenPodManagerAddress,
  platformId,
} from '../constants';
import { getAddress } from 'viem';
import { abi } from '../abi';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import BigNumber from 'bignumber.js';

/**
 * Returns the deposit positions for a given owner
 * @param owner - The address of the owner
 * @param cache - The cache instance
 * @returns The deposit positions
 */
export const getDepositPositions = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);
  const podManagerAddress = getAddress(eigenPodManagerAddress);

  const podUserAddress = await client.readContract({
    address: podManagerAddress,
    abi: [abi.ownerToPod],
    functionName: abi.ownerToPod.name,
    args: [getAddress(owner)],
  });

  // If the user has no pod, the contract returns the ethereum native address address
  if (!podUserAddress || podUserAddress === ethereumNativeAddress) return [];

  // Get ETH balance of each strategy contract
  const balance = await client.getBalance({
    address: podUserAddress,
  });

  const assets: PortfolioAsset[] = [];
  const tokenPrice = await cache.getTokenPrice(
    ethereumNativeAddress,
    NetworkId.ethereum
  );
  const asset = tokenPriceToAssetToken(
    ethereumNativeAddress,
    BigNumber(balance.toString())
      .div(10 ** ethereumNativeDecimals)
      .toNumber(),
    NetworkId.ethereum,
    tokenPrice
  );
  assets.push(asset);

  const elements: PortfolioElement = {
    networkId: NetworkId.ethereum,
    name: `Proxy Balance ${podUserAddress}`,
    platformId,
    label: 'Deposit',
    type: PortfolioElementType.multiple,
    value: asset.value,
    data: {
      assets: assets,
    },
  };
  return [elements];
};
