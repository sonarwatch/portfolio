import BigNumber from 'bignumber.js';
import { ethereumNetwork } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { EvmClient } from '../../utils/clients/types';
import { wstETHAddress, stMATICAddress, maticTokenAddress } from './constants';
import { maticAbi, wstETHAbi } from './abis';
import { ethFactor } from '../../utils/evm/constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

export const getWstETHAsset = async (
  balance: bigint,
  client: EvmClient,
  elementRegistry: ElementRegistry
) => {
  const conversionResult = await client.readContract({
    address: wstETHAddress,
    abi: wstETHAbi,
    functionName: 'getStETHByWstETH',
    args: [balance],
  });

  const stETHAmount = new BigNumber((conversionResult as bigint).toString());

  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });
  element.addAsset({
    address: ethereumNetwork.native.address,
    amount: stETHAmount.div(ethFactor).toNumber(),
  });
};

export const getStMATICAsset = async (
  balance: bigint,
  client: EvmClient,
  elementRegistry: ElementRegistry
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

  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
  });
  element.addAsset({
    address: maticTokenAddress,
    amount: maticAmount,
  });
};
