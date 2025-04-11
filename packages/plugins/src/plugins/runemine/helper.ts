import { PublicKey } from '@solana/web3.js';
import { pid } from './constants';

export function getUserStakingPda(owner: string) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('user'),
      Buffer.from([6, 0, 0, 0, 0, 0, 0, 0]),
      new PublicKey(owner).toBuffer(),
    ],
    pid
  )[0];
}
