import { PublicKey } from '@solana/web3.js';
import { airdropPid } from './constants';

export function getClaimStatusPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('ClaimStatus'),
      new PublicKey(owner).toBuffer(),
      new PublicKey('35dujSJCZvGzwcjaWWjwmVKxaDkavifSUoSMogC2WwdV').toBuffer(),
    ],
    airdropPid
  )[0];
}
