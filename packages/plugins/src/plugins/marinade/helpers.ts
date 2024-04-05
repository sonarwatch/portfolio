import { PublicKey } from '@solana/web3.js';
import { claimProgram } from './constants';

export function getClaimPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('claim_record', 'utf-8'),
      new PublicKey('inTrQECqatDmvAt7ahYeWg82efX5PsxhiFXzQk9eKYG').toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    claimProgram
  )[0];
}
