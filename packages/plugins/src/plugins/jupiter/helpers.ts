import { PublicKey } from '@solana/web3.js';

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
