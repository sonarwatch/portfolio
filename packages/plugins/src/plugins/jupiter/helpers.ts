import { PublicKey } from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';
import { PriceResponse } from './types';
import { jupApiParams, lockerPubkey, voteProgramId } from './constants';

export function getVotePda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('Escrow'),
      lockerPubkey.toBytes(),
      new PublicKey(owner).toBytes(),
    ],
    voteProgramId
  )[0];
}

const maxIdsPerRequest = 100;
const jupPriceApiUrl = 'https:/lite-api.jup.ag/price/v2';

export async function getJupiterPrices(mints: PublicKey[], vsMint: PublicKey) {
  let res;
  const pricesData = [];
  let subMints;
  let start = 0;
  let end = maxIdsPerRequest;
  const endpoint = `${jupPriceApiUrl}?${jupApiParams ?? ''}`;

  do {
    subMints = mints.slice(start, end);
    res = await axios.get<unknown, AxiosResponse<PriceResponse>>(endpoint, {
      params: {
        ids: subMints.map((m) => m.toString()).join(','),
        vsToken: vsMint.toString(),
      },
    });
    start = end;
    end += maxIdsPerRequest;
    pricesData.push(res.data.data);
  } while (mints.at(start));

  const prices: Map<string, number> = new Map();
  for (const priceData of pricesData) {
    for (const [, value] of Object.entries(priceData)) {
      if (value) prices.set(value.id, value.price);
    }
  }
  return prices;
}
