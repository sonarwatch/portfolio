import {
  EvmNetworkIdType,
  NetworkId,
  formatTokenAddress,
  networks,
} from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import { getEvmClient } from '../../utils/clients';
import { MorphoAaveV3Abi } from './utils/abis';
import { morphoAaveV3Address, platformId } from './constants';
import WadRayMath from './utils/WadRayMath';
import { MorphoAssetAPI, ParsedUpdatedIndexes, UpdatedIndexes } from './types';

export function parseUpdatedIndexes(
  updatedIndexes: UpdatedIndexes
): ParsedUpdatedIndexes {
  return {
    borrow: {
      p2pIndex: updatedIndexes.borrow.p2pIndex.toString(),
      poolIndex: updatedIndexes.borrow.poolIndex.toString(),
    },
    supply: {
      p2pIndex: updatedIndexes.supply.p2pIndex.toString(),
      poolIndex: updatedIndexes.supply.poolIndex.toString(),
    },
  };
}

export const getCurrentSupplyBalanceInOf = async (
  underlying: string,
  owner: string
) => {
  const client = getEvmClient(NetworkId.ethereum);

  const promises = [
    client.readContract({
      abi: MorphoAaveV3Abi,
      functionName: 'updatedIndexes',
      args: [getAddress(underlying)],
      address: getAddress(morphoAaveV3Address),
    }),
    client.readContract({
      abi: MorphoAaveV3Abi,
      functionName: 'scaledP2PSupplyBalance',
      args: [getAddress(underlying), getAddress(owner)],
      address: getAddress(morphoAaveV3Address),
    }),
    client.readContract({
      abi: MorphoAaveV3Abi,
      functionName: 'scaledPoolSupplyBalance',
      args: [getAddress(underlying), getAddress(owner)],
      address: getAddress(morphoAaveV3Address),
    }),
  ] as const;
  const results = await Promise.all(promises);

  const updatedIndexes = results[0];
  const scaledP2PSupplyBalance = results[1];
  const scaledPoolSupplyBalance = results[2];

  const { p2pIndex, poolIndex } = updatedIndexes.supply;
  const balanceInP2P = WadRayMath.rayMul(scaledP2PSupplyBalance, p2pIndex);
  const balanceOnPool = WadRayMath.rayMul(scaledPoolSupplyBalance, poolIndex);
  const totalBalance = balanceInP2P.add(balanceOnPool);
  return totalBalance;
};

export const getCurrentCollateralBalanceInOf = async (
  underlying: string,
  owner: string
) => {
  const client = getEvmClient(NetworkId.ethereum);

  const collateralBalance = await client.readContract({
    abi: MorphoAaveV3Abi,
    functionName: 'collateralBalance',
    args: [getAddress(underlying), getAddress(owner)],
    address: getAddress(morphoAaveV3Address),
  });
  return collateralBalance;
};

export const getCurrentBorrowBalanceInOf = async (
  underlying: string,
  owner: string
) => {
  const client = getEvmClient(NetworkId.ethereum);

  const promises = [
    client.readContract({
      abi: MorphoAaveV3Abi,
      functionName: 'updatedIndexes',
      args: [getAddress(underlying)],
      address: getAddress(morphoAaveV3Address),
    }),
    client.readContract({
      abi: MorphoAaveV3Abi,
      functionName: 'scaledP2PBorrowBalance',
      args: [getAddress(underlying), getAddress(owner)],
      address: getAddress(morphoAaveV3Address),
    }),
    client.readContract({
      abi: MorphoAaveV3Abi,
      functionName: 'scaledPoolBorrowBalance',
      args: [getAddress(underlying), getAddress(owner)],
      address: getAddress(morphoAaveV3Address),
    }),
  ] as const;
  const results = await Promise.all(promises);

  const updatedIndexes = results[0];
  const scaledP2PBorrowBalance = results[1];
  const scaledPoolBorrowBalance = results[2];

  const { p2pIndex, poolIndex } = updatedIndexes.supply;
  const balanceInP2P = WadRayMath.rayMul(scaledP2PBorrowBalance, p2pIndex);
  const balanceOnPool = WadRayMath.rayMul(scaledPoolBorrowBalance, poolIndex);
  const totalBalance = balanceInP2P.add(balanceOnPool);
  return totalBalance;
};

export function buildTokenPriceSources(
  tokens: MorphoAssetAPI[],
  networkId: EvmNetworkIdType
) {
  const timestamp = Date.now();
  return (
    tokens
      // API returns null price sometimes, so we filter them out
      .filter((token) => !!token.priceUsd)
      .map((token) => ({
        address: formatTokenAddress(token.address, networkId),
        decimals: token.decimals,
        id: platformId,
        networkId,
        platformId,
        price: token.priceUsd!,
        timestamp,
        weight: 1,
      }))
  );
}

export function buildTokenMetaDataItems(
  tokens: MorphoAssetAPI[],
  networkId: EvmNetworkIdType
) {
  const metaData = tokens.map((token) => ({
    chainId: networks[networkId].chainId,
    address: token.address,
    decimals: token.decimals,
    name: token.name,
    symbol: token.symbol,
    logoURI: token.logoURI,
    extensions: {},
  }));

  return metaData.map((token) => {
    const address = formatTokenAddress(token.address, networkId);
    return {
      key: address,
      value: {
        ...token,
        address,
      },
    };
  });
}
