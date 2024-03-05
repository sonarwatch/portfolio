import { PublicKey } from '@solana/web3.js';
import { programId } from './constants';

export async function getStakingAccountAddress(
  owner: string
): Promise<PublicKey> {
  return PublicKey.findProgramAddressSync(
    [new PublicKey(owner).toBuffer()],
    programId
  )[0];
}
