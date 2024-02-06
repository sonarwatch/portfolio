import { PublicKey } from '@solana/web3.js';
import { flashPid, poolsPkeys } from './constants';

export function getPdas(owner: string) {
  return poolsPkeys.map(
    (key) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('stake', 'utf8'),
          new PublicKey(owner).toBuffer(),
          key.toBuffer(),
        ],
        flashPid
      )[0]
  );
}
