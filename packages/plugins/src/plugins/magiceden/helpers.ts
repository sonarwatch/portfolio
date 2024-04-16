import { PublicKey } from '@solana/web3.js';
import { m2AuctionHouse, m2Prefix, m2Program } from './constants';

export function getEscrowAccount(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(m2Prefix),
      m2AuctionHouse.toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    m2Program
  )[0];
}
