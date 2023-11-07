import { PublicKey } from '@solana/web3.js';
import { flexProgramId } from './constants';

export function getDerivedAccount(owner: string): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('flexlend', 'utf8'), new PublicKey(owner).toBuffer()],
    flexProgramId
  );

  return pda.toString();
}
