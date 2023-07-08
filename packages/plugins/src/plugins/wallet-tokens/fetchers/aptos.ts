import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';

import BigNumber from 'bignumber.js';
import { platformId } from '../constants';
import { getClientAptos } from '../../../utils/clients';
import {
  CoinStoreData,
  coinStore,
  getAccountResources,
  isCoinStoreRessourceType,
  parseTypeString,
} from '../../../utils/aptos';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, owner);
  if (!resources) return [];
  const assets: PortfolioAsset[] = [];

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const resourceType = resource.type;
    if (!isCoinStoreRessourceType(resourceType)) continue;

    const parseCoinType = parseTypeString(resource.type);

    if (parseCoinType.root !== coinStore) continue;
    if (!parseCoinType.keys) continue;

    const coinType = parseCoinType.keys.at(0)?.type;
    if (coinType === undefined) continue;

    const tokenPrice = await cache.getTokenPrice(coinType, NetworkId.aptos);
    if (!tokenPrice) continue;
    if (!tokenPrice.isBase) continue;

    const coinStoreData = resource.data as CoinStoreData;
    const amount = new BigNumber(coinStoreData.coin.value)
      .div(10 ** tokenPrice.decimals)
      .toNumber();
    if (amount === 0) continue;

    const price = tokenPrice?.price || null;
    const value = price ? amount * price : null;

    const asset: PortfolioAsset = {
      networkId: NetworkId.aptos,
      type: PortfolioAssetType.token,
      value,
      data: { address: coinType, price, amount },
    };
    assets.push(asset);
  }

  if (assets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.aptos,
    platformId,
    label: 'Wallet',
    value: getUsdValueSum(assets.map((a) => a.value)),
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-aptos`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
