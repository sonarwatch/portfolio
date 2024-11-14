import { PublicKey } from '@solana/web3.js';
import { pid } from './constants';

export function getStakePda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [new PublicKey(owner).toBytes(), Buffer.from('userStakeInfo', 'utf-8')],
    pid
  )[0];
}
