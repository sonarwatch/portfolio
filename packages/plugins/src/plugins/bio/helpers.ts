import { PublicKey } from '@solana/web3.js';
import { pid } from './constants';

export function getStakePdas(owner: string, boosts: string[]): PublicKey[] {
  return boosts.map(
    (boost) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('stake', 'utf-8'),
          new PublicKey(owner).toBuffer(),
          new PublicKey(boost).toBuffer(),
        ],
        pid
      )[0]
  );
}
