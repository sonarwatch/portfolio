import { PublicKey } from '@solana/web3.js';
import { nosMint, nosanaStakingPid } from './constants';

export function getStakePubKey(owner: string) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('stake', 'utf8'),
      new PublicKey(nosMint).toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    nosanaStakingPid
  )[0];
}
