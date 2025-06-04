import { PublicKey } from '@solana/web3.js';
import { stakePid } from './constants';

export function getStakeAccountPda(
  userPublicKey: PublicKey,
  stakePoolPublicKey: PublicKey
): PublicKey {
  const seeds = [
    Buffer.from('stake_account', 'utf8'),
    userPublicKey.toBuffer(),
    stakePoolPublicKey.toBuffer(),
  ];

  return PublicKey.findProgramAddressSync(seeds, stakePid)[0];
}
