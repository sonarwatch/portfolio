import { PublicKey } from '@solana/web3.js';
import { lockerPubkey, voteProgramId } from './constants';

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
