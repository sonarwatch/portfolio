import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementMultiple,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';

import { BigNumber } from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../constants';
import { getClientSei } from '../../../utils/clients';
import { getAllBalances } from '../../../utils/sei';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = await getClientSei();
  const balances = await getAllBalances(
    client.cosmos.bank.v1beta1.allBalances,
    owner
  );
  if (balances.length === 0) return [];

  const tokenPrices = await cache.getTokenPrices(
    balances.map((b) => b.denom),
    NetworkId.sei
  );

  const assets: PortfolioAssetToken[] = [];
  tokenPrices.forEach((tokenPrice, i) => {
    if (!tokenPrice) return;
    const balance = balances[i];
    const amount = new BigNumber(balance.amount)
      .div(10 ** tokenPrice.decimals)
      .toNumber();
    const value = amount * tokenPrice.price;
    const asset: PortfolioAssetToken = {
      type: 'token',
      attributes: {},
      data: {
        address: tokenPrice.address,
        amount,
        price: tokenPrice.price,
      },
      networkId: NetworkId.sei,
      value,
    };
    assets.push(asset);
  });

  if (assets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.sei,
    platformId: walletTokensPlatform.id,
    label: 'Wallet',
    value: getUsdValueSum(assets.map((a) => a.value)),
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-sei`,
  networkId: NetworkId.sei,
  executor,
};

export default fetcher;
