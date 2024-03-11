import { PublicKey } from '@solana/web3.js';
import { flexProgramId } from './constants';

export function getDerivedAccount(owner: string): string {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('flexlend', 'utf8'), new PublicKey(owner).toBuffer()],
    flexProgramId
  )[0].toString();
}
