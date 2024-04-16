import { PublicKey } from '@solana/web3.js';
import { clonePid } from './constants';

export function getUserAccount(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user', 'utf-8'), new PublicKey(owner).toBuffer()],
    clonePid
  )[0];
}
