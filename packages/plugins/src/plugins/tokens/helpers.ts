import axios, { AxiosResponse } from 'axios';
import {
  NetworkIdType,
  PortfolioElementLabel,
  TokenPriceSource,
  UniTokenList,
  UniTokenListVersion,
} from '@sonarwatch/portfolio-core';
import { nIdsToFetch, walletTokensPlatform } from './constants';
import { CoingeckoSimpleRes, TokenData } from './types';
import shuffleArray from '../../utils/misc/shuffleArray';
import sleep from '../../utils/misc/sleep';
import { coingeckoCoinsPriceUrl } from '../../utils/coingecko/constants';

export function compareVersion(
  versionA: UniTokenListVersion,
  versionB: UniTokenListVersion
) {
  if (versionA.major > versionB.major) return 1;
  if (versionA.major < versionB.major) return -1;
  if (versionA.minor > versionB.minor) return 1;
  if (versionA.minor < versionB.minor) return -1;
  if (versionA.patch > versionB.patch) return 1;
  if (versionA.patch < versionB.patch) return -1;
  return 0;
}

export function isLatestVersion(
  newVersion: UniTokenListVersion,
  oldVersion: UniTokenListVersion
) {
  return compareVersion(newVersion, oldVersion) === 1;
}

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
    await sleep(10000);
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
    if (!coingeckoSimpleRes) {
      await sleep(60000);
      continue;
    }

    for (let i = 0; i < currIdsToFetch.length; i += 1) {
      const id = currIdsToFetch[i];
      const usd = coingeckoSimpleRes.data[id]?.usd;
      if (!usd) continue;
      priceByCoingeckoId.set(id, usd);
    }
  }
  return priceByCoingeckoId;
}

export function getTokensData(tokenList: UniTokenList): TokenData[] {
  const tokensData = tokenList.tokens.reduce((cTokensData: TokenData[], ti) => {
    if (!ti.extensions) return cTokensData;
    const { coingeckoId } = ti.extensions;
    if (typeof coingeckoId !== 'string') return cTokensData;

    const tokenData: TokenData = {
      address: ti.address,
      coingeckoId,
      decimals: ti.decimals,
      platformId: walletTokensPlatform.id,
    };
    cTokensData.push(tokenData);
    return cTokensData;
  }, []);
  return tokensData;
}

export const lpTagSeparator = '<|>';

export function getLpTag(
  platformId: string,
  elementName?: string,
  label?: PortfolioElementLabel
) {
  return `${platformId}${
    label ? `${lpTagSeparator}${label}` : `${lpTagSeparator}`
  }${elementName ? `${lpTagSeparator}${elementName}` : `${lpTagSeparator}`}`;
}

export function parseLpTag(tag: string): {
  platformId: string;
  elementName?: string;
  label?: PortfolioElementLabel;
} {
  const split = tag.split(lpTagSeparator, 3);
  if (split.length < 1) throw new Error(`Tag is not valid: ${tag}`);
  return {
    platformId: split[0],
    label:
      split.at(1) === '' ? undefined : (split.at(1) as PortfolioElementLabel),
    elementName: split.at(2) === '' ? undefined : split.at(2),
  };
}
