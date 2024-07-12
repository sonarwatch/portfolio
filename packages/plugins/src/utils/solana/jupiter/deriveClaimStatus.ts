import { PublicKey } from '@solana/web3.js';

export function deriveClaimStatus(
  claimant: string,
  merkleTree: string,
  merkleDistributor: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('ClaimStatus'),
      new PublicKey(claimant).toBytes(),
      new PublicKey(merkleTree).toBytes(),
    ],
    new PublicKey(merkleDistributor)
  )[0];
}
