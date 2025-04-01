import { NetworkId, ethereumNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  maticTokenAddress,
  platformId,
  stakedAddresses,
  wstETHAddress,
  stMATICAddress,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ethFactor } from '../../utils/evm/constants';
import { maticAbi, wstETHAbi } from './abis';
import { getBalances } from '../../utils/evm/getBalances';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const balancesResults = await getBalances(
    owner,
    stakedAddresses,
    NetworkId.ethereum
  );

  const assets = await Promise.all(
    balancesResults.map(async (balance, index) => {
      if (!balance) return null;

      const amount = new BigNumber(balance.toString());
      if (amount.isZero()) return null;

      // Handle wstETH conversion
      if (
        stakedAddresses[index].toLowerCase() === wstETHAddress.toLowerCase()
      ) {
        const client = getEvmClient(NetworkId.ethereum);
        const conversionResult = await client.readContract({
          address: wstETHAddress,
          abi: wstETHAbi,
          functionName: 'getStETHByWstETH',
          args: [balance],
        });

        const stETHAmount = new BigNumber(
          (conversionResult as bigint).toString()
        );
        const ethTokenPrice = await cache.getTokenPrice(
          ethereumNetwork.native.address,
          NetworkId.ethereum
        );

        return tokenPriceToAssetToken(
          ethereumNetwork.native.address,
          stETHAmount.div(ethFactor).toNumber(),
          NetworkId.ethereum,
          ethTokenPrice
        );
      }

      // Handle stMATIC conversion
      if (
        stakedAddresses[index].toLowerCase() === stMATICAddress.toLowerCase()
      ) {
        const maticClient = getEvmClient(NetworkId.ethereum);
        const conversionResult = await maticClient.readContract({
          address: stMATICAddress,
          abi: maticAbi,
          functionName: 'convertStMaticToMatic',
          args: [balance],
        });

        const maticAmount = new BigNumber(
          (conversionResult as bigint[]).at(0)?.toString() || '0'
        );
        const maticPrice = await cache.getTokenPrice(
          maticTokenAddress,
          NetworkId.ethereum
        );

        if (!maticPrice?.price) return null;

        return tokenPriceToAssetToken(
          maticTokenAddress,
          maticAmount.div(ethFactor).toNumber(),
          NetworkId.ethereum,
          maticPrice
        );
      }

      // For ETH staking tokens
      const ethTokenPrice = await cache.getTokenPrice(
        ethereumNetwork.native.address,
        NetworkId.ethereum
      );

      if (!ethTokenPrice?.price) return null;

      return tokenPriceToAssetToken(
        ethereumNetwork.native.address,
        amount.div(ethFactor).toNumber(),
        NetworkId.ethereum,
        ethTokenPrice
      );
    })
  );

  const validAssets = assets.filter(
    (asset): asset is NonNullable<typeof asset> => asset !== null
  );
  if (validAssets.length === 0) return [];

  const totalValue = validAssets.reduce(
    (acc, asset) => acc + (asset.value || 0),
    0
  );

  return [
    {
      type: 'multiple',
      label: 'Staked',
      networkId: NetworkId.ethereum,
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
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
