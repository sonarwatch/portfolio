import { PublicKey } from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';
import { DatapiAsset, DatapiAssetsResponse } from './types';
import { jupDatapiHeaderKey, jupDatapiHeaderValue } from './constants';

const maxIdsPerRequest = 50;
const jupDatapiAssetsUrl = 'https://datapi.jup.ag/v1/assets';

export async function getJupiterPrices(mints: PublicKey[]) {
  let res;
  const pricesData = [];
  let subMints;
  let start = 0;
  let end = maxIdsPerRequest;
  const endpoint = `${jupDatapiAssetsUrl}`;

  const uniqueMints = [...new Set(mints.map((m) => m.toString()))];

  do {
    subMints = uniqueMints.slice(start, end);

    let headers = {};
    if (jupDatapiHeaderKey && jupDatapiHeaderValue)
      headers = {
        [jupDatapiHeaderKey]: jupDatapiHeaderValue,
      };

    res = await axios.get<unknown, AxiosResponse<DatapiAssetsResponse>>(
      endpoint,
      {
        params: {
          ids: subMints.map((m) => m.toString()).join(','),
        },
        headers,
      }
    );

    start = end;
    end += maxIdsPerRequest;
    pricesData.push(res.data.assets);
  } while (uniqueMints.at(start));

  const prices: Map<string, DatapiAsset> = new Map();
  for (const priceData of pricesData) {
    for (const [, asset] of Object.entries(priceData)) {
      if (asset.usdPrice) prices.set(asset.id, asset);
    }
  }

  return prices;
}
