import { PublicKey } from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';
import { PriceResponse } from './types';
import { lockerPubkey, voteProgramId } from './launchpad/constants';

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

export async function getJupiterPrices(mints: PublicKey[], vsMint: PublicKey) {
  const endpoint =
    process.env['PORTFOLIO_JUP_PRICE_API_URL'] || 'https://api.jup.ag/price/v2';

  let res;
  const pricesData = [];
  let subMints;
  let start = 0;
  let end = maxIdsPerRequest - 1;
  do {
    subMints = mints.slice(start, end);
    res = await axios.get<unknown, AxiosResponse<PriceResponse>>(endpoint, {
      params: {
        ids: subMints.map((m) => m.toString()).join(','),
        vsToken: vsMint.toString(),
      },
    });
    start += maxIdsPerRequest;
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
