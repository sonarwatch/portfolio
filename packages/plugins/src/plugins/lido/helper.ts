import BigNumber from 'bignumber.js';
import { ethereumNetwork } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { EvmClient } from '../../utils/clients/types';
import {
  wstETHAddress,
  stMATICAddress,
  maticTokenAddress,
  networkId,
} from './constants';
import { maticAbi, wstETHAbi } from './abis';
import { ethFactor } from '../../utils/evm/constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

export const getWstETHAsset = async (
  balance: bigint,
  client: EvmClient,
  cache: Cache
) => {
  const conversionResult = await client.readContract({
    address: wstETHAddress,
    abi: wstETHAbi,
    functionName: 'getStETHByWstETH',
    args: [balance],
  });

  const stETHAmount = new BigNumber((conversionResult as bigint).toString());
  const ethTokenPrice = await cache.getTokenPrice(
    ethereumNetwork.native.address,
    networkId
  );

  if (!ethTokenPrice?.price) return null;

  return tokenPriceToAssetToken(
    ethereumNetwork.native.address,
    stETHAmount.div(ethFactor).toNumber(),
    networkId,
    ethTokenPrice
  );
};

export const getStMATICAsset = async (
  balance: bigint,
  client: EvmClient,
  cache: Cache
) => {
  const conversionResult = await client.readContract({
    address: stMATICAddress,
    abi: maticAbi,
    functionName: 'convertStMaticToMatic',
    args: [balance],
  });

  const maticAmount = new BigNumber(
    (conversionResult as bigint[]).at(0)?.toString() || '0'
  );
  const maticPrice = await cache.getTokenPrice(maticTokenAddress, networkId);

  if (!maticPrice?.price) return null;

  return tokenPriceToAssetToken(
    maticTokenAddress,
    maticAmount.div(ethFactor).toNumber(),
    networkId,
    maticPrice
  );
};
