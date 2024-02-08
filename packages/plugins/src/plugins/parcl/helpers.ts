import { PublicKey } from '@solana/web3.js';
import { programId } from './constants';

export function getLpAccountPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('lp_account', 'utf-8'),
      new PublicKey('82dGS7Jt4Km8ZgwZVRsJ2V6vPXEhVdgDaMP7cqPGG1TW').toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    programId
  )[0];
}
