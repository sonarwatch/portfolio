import { ethereumNetwork, getUsdValueSum } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
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
import { getBalances } from '../../utils/evm/getBalances';
import { getWstETHAsset, getStMATICAsset } from './helper';

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
