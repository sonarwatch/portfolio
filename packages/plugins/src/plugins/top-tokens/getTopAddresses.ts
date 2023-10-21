import axios, { AxiosResponse } from 'axios';
import {
  NetworkIdType,
  formatAddress,
  formatTokenAddress,
  networks,
} from '@sonarwatch/portfolio-core';
import forcedAddresses from './forcedAddresses';
import { coingeckoCoinsMarketsUrl } from '../../utils/coingecko/constants';
import {
  CoingeckoCoinsListResponse,
  CoingeckoCoinsMarketsResponse,
} from '../../utils/coingecko/types';
import { topAddressesMaxSize } from './constants';
import sleep from '../../utils/misc/sleep';
import ignoredAddresses from './ignoredAddresses';

export default async function getTopAddresses(
  networkId: NetworkIdType,
  coingeckoCoinsListResponse: CoingeckoCoinsListResponse
): Promise<string[]> {
  const network = networks[networkId];
  if (!network) throw new Error('Network is missing');

  const addressById: Map<string, string> = new Map();
  coingeckoCoinsListResponse.forEach((gCoin) => {
    const address = gCoin.platforms[network.geckoId];
    if (!address) return;
    addressById.set(gCoin.id, formatTokenAddress(address, networkId));
  });

  const addresses: Set<string> = new Set();
  addresses.add(network.native.address);
  if (network.nativeWrapped) addresses.add(network.nativeWrapped.address);

  const cForcedAddresses = forcedAddresses.get(network.id);
  if (cForcedAddresses) {
    cForcedAddresses.forEach((a) =>
      addresses.add(formatAddress(a, network.addressSystem))
    );
  }

  const cIgnoredAddresses = ignoredAddresses.get(network.id);
  let page = 0;
  while (addresses.size < topAddressesMaxSize && page < 20) {
    page += 1;
    const coinsMarketsRes = await axios
      .get<unknown, AxiosResponse<CoingeckoCoinsMarketsResponse>, unknown>(
        coingeckoCoinsMarketsUrl,
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            page,
          },
          timeout: 5000,
        }
      )
      .catch(() => null);
    await sleep(20000);
    if (!coinsMarketsRes) {
      await sleep(120000);
      continue;
    }
    coinsMarketsRes.data.forEach((coinMarket) => {
      const address = addressById.get(coinMarket.id);
      if (!address) return;
      if (cIgnoredAddresses?.includes(address)) return;
      addresses.add(address);
    });
  }
  return Array.from(addresses).slice(0, topAddressesMaxSize);
}
