import { PublicKey } from '@solana/web3.js';
import { programId } from './constants';

export function getStakingAccountAddress(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [new PublicKey(owner).toBuffer()],
    programId
  )[0];
}
