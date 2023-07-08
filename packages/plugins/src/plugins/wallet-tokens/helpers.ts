import axios, { AxiosResponse } from 'axios';
import {
  NetworkIdType,
  TokenPriceSource,
  UniTokenList,
} from '@sonarwatch/portfolio-core';
import { nIdsToFetch, coingeckoCoinsPriceUrl, platformId } from './constants';
import { CoingeckoSimpleRes, TokenData } from './types';
import shuffleArray from '../../utils/misc/shuffleArray';
import sleep from '../../utils/misc/sleep';

export async function getCoingeckoSources(
  networkId: NetworkIdType,
  tokensData: TokenData[]
): Promise<TokenPriceSource[]> {
  const coingeckoIds = new Set(tokensData.map((t) => t.coingeckoId));
  const pricesByCoingeckoId = await getPricesFromCoingeckoIds(coingeckoIds);
  const sources: TokenPriceSource[] = [];

  const tdsByCoingeckoId: Record<string, TokenData[]> = {};
  tokensData.forEach((td) => {
    if (!tdsByCoingeckoId[td.coingeckoId]) {
      tdsByCoingeckoId[td.coingeckoId] = [];
    }
    tdsByCoingeckoId[td.coingeckoId].push(td);
  });

  pricesByCoingeckoId.forEach((price, coingeckoId) => {
    const currTokensData = tdsByCoingeckoId[coingeckoId];
    if (!currTokensData) return;
    currTokensData.forEach((td) => {
      const source: TokenPriceSource = {
        address: td.address,
        networkId,
        platformId: td.platformId,
        decimals: td.decimals,
        price,
        timestamp: Date.now(),
        id: 'coingecko',
        weight: 0,
      };
      sources.push(source);
    });
  });
  return sources;
}

async function getPricesFromCoingeckoIds(
  coingeckoIds: Set<string>
): Promise<Map<string, number>> {
  const idsToFetch = [...Array.from(coingeckoIds)];
  shuffleArray(idsToFetch);

  const priceByCoingeckoId = new Map<string, number>();
  while (idsToFetch.length !== 0) {
    const currIdsToFetch = idsToFetch.splice(0, nIdsToFetch);
    const coingeckoSimpleRes: AxiosResponse<CoingeckoSimpleRes> | null =
      await axios
        .get(coingeckoCoinsPriceUrl, {
          params: {
            ids: currIdsToFetch.join(','),
            vs_currencies: 'usd',
          },
        })
        .catch(() => null);
    if (!coingeckoSimpleRes) continue;

    for (let i = 0; i < currIdsToFetch.length; i += 1) {
      const id = currIdsToFetch[i];
      const usd = coingeckoSimpleRes.data[id]?.usd;
      if (!usd) continue;
      priceByCoingeckoId.set(id, usd);
    }
    await sleep(10000);
  }
  return priceByCoingeckoId;
}

export async function getTokensData(
  tokenList: UniTokenList
): Promise<TokenData[]> {
  const tokensData = tokenList.tokens.reduce((cTokensData: TokenData[], ti) => {
    if (!ti.extensions) return cTokensData;
    const { coingeckoId } = ti.extensions;
    if (typeof coingeckoId !== 'string') return cTokensData;

    const tokenData: TokenData = {
      address: ti.address,
      coingeckoId,
      decimals: ti.decimals,
      platformId,
    };
    cTokensData.push(tokenData);
    return cTokensData;
  }, []);
  return tokensData;
}
