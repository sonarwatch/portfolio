import {
  EvmNetworkIdType,
  PortfolioAssetToken,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { getBalances } from './getBalances';
import tokenPriceToAssetTokens from '../misc/tokenPriceToAssetTokens';

export async function getTokenAssets(
  owner: string,
  addresses: string[],
  networkId: EvmNetworkIdType,
  cache: Cache
) {
  const fAddresses = [...new Set(addresses)];
  const balances = await getBalances(owner, fAddresses, networkId);
  const nonZeroAddresses = fAddresses.filter((adress, i) => {
    const balance = balances[i];
    if (!balance) return false;
    return true;
  });
  const tokenPrices = await cache.getTokenPrices(nonZeroAddresses, networkId);
  let count = 0;
  const assets: PortfolioAssetToken[][] = [];
  for (let i = 0; i < balances.length; i++) {
    const balance = balances[i];
    if (!balance) continue;
    const tokenPrice = tokenPrices[count];
    count += 1;
    if (!tokenPrice) continue;
    const amount = new BigNumber(balance.toString())
      .div(10 ** tokenPrice.decimals)
      .toNumber();
    assets.push(
      tokenPriceToAssetTokens(tokenPrice.address, amount, networkId, tokenPrice)
    );
  }
  return assets;
}
