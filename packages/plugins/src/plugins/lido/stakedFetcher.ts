import { ethereumNetwork, getUsdValueSum } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  maticTokenAddress,
  platformId,
  stakedAddresses,
  wstETHAddress,
  stMATICAddress,
  networkId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ethFactor } from '../../utils/evm/constants';
import { maticAbi, wstETHAbi } from './abis';
import { getBalances } from '../../utils/evm/getBalances';
import { EvmClient } from '../../utils/clients/types';

const getWstETHAsset = async (
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

const getStMATICAsset = async (
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

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(networkId);
  const balancesResults = await getBalances(owner, stakedAddresses, networkId);

  const assets = await Promise.all(
    balancesResults.map(async (balance, index) => {
      if (!balance) return undefined;

      const amount = new BigNumber(balance.toString());
      if (amount.isZero()) return undefined;

      if (stakedAddresses[index] === wstETHAddress) {
        return getWstETHAsset(balance, client, cache);
      }

      if (stakedAddresses[index] === stMATICAddress) {
        return getStMATICAsset(balance, client, cache);
      }

      // For ETH staking tokens
      const ethTokenPrice = await cache.getTokenPrice(
        ethereumNetwork.native.address,
        networkId
      );

      if (!ethTokenPrice?.price) return undefined;

      return tokenPriceToAssetToken(
        ethereumNetwork.native.address,
        amount.div(ethFactor).toNumber(),
        networkId,
        ethTokenPrice
      );
    })
  );

  const validAssets = assets.filter((asset) => !!asset);
  if (validAssets.length === 0) return [];

  const totalValue = getUsdValueSum(validAssets.map((asset) => asset.value));

  return [
    {
      type: 'multiple',
      label: 'Staked',
      networkId,
      platformId,
      value: totalValue,
      data: {
        assets: validAssets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staked`,
  networkId,
  executor,
};

export default fetcher;
