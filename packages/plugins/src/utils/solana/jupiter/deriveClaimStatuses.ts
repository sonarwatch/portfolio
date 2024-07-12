import { PublicKey } from '@solana/web3.js';
import { deriveClaimStatus } from './deriveClaimStatus';

export function deriveClaimStatuses(
  claimant: string,
  distributors: string[],
  programId: string
): PublicKey[] {
  return distributors.map((d) => deriveClaimStatus(claimant, d, programId));
}
