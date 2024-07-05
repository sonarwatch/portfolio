import { PublicKey } from '@solana/web3.js';

export function findClaimStatusKey(
  claimant: string,
  distributor: string,
  programId: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('ClaimStatus'),
      new PublicKey(distributor).toBytes(),
      new PublicKey(claimant).toBytes(),
    ],
    new PublicKey(programId)
  )[0];
}

export function findClaimStatusesKeys(
  claimant: string,
  distributors: string[],
  programId: string
): PublicKey[] {
  return distributors.map(
    (distributor) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('ClaimStatus'),
          new PublicKey(distributor).toBytes(),
          new PublicKey(claimant).toBytes(),
        ],
        new PublicKey(programId)
      )[0]
  );
}
