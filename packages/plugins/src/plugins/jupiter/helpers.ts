import { PublicKey } from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';
import { lockerPubkey, voteProgramId } from './constants';
import { PriceResponse } from './types';

export function deriveClaimStatus(
  claimant: PublicKey,
  distributor: PublicKey,
  programId: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('ClaimStatus'), claimant.toBytes(), distributor.toBytes()],
    programId
  );
}

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

export async function getPrices(mints: PublicKey[], vsMint: PublicKey) {
  const res = await axios.get<unknown, AxiosResponse<PriceResponse>>(
    'https://price.jup.ag/v4/price',
    {
      params: {
        ids: mints.map((m) => m.toString()).join(','),
        vsToken: vsMint.toString(),
      },
    }
  );
  const prices: Map<string, number> = new Map();
  for (const [, value] of Object.entries(res.data.data)) {
    prices.set(value.id, value.price);
  }
  return prices;
}
