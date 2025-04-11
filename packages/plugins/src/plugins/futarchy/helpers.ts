import { PublicKey } from '@solana/web3.js';
import { launchpadPid } from './constants';

export function getFundingRecordPda(owner: string, launch: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('funding_record'),
      new PublicKey(launch).toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    launchpadPid
  )[0];
}
