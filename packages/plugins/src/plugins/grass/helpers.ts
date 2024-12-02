import { PublicKey } from '@solana/web3.js';
import { pid, pidDistributor } from './constants';

export function getStakePda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [new PublicKey(owner).toBytes(), Buffer.from('userStakeInfo', 'utf-8')],
    pid
  )[0];
}

export function deriveClaimStatus(
  claimant: string,
  distributor: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('ClaimStatus'),
      new PublicKey(claimant).toBytes(),
      new PublicKey(distributor).toBytes(),
    ],
    pidDistributor
  )[0];
}
