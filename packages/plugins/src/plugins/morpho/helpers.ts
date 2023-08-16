import { NetworkId } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import { getEvmClient } from '../../utils/clients';
import { MorphoAaveV3Abi } from './utils/abis';
import { morphoAaveV3Address } from './constants';
import WadRayMath from './utils/WadRayMath';
import { ParsedUpdatedIndexes, UpdatedIndexes } from './types';

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
