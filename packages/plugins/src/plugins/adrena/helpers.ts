import { PublicKey } from '@solana/web3.js';
import { adxMint, alpMint, pid } from './constants';

export function getStakingPda(stakedTokenMint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('staking'), stakedTokenMint.toBuffer()],
    pid
  )[0];
}

export function getUserStakingPda(owner: PublicKey, stakingPda: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user_staking'), owner.toBuffer(), stakingPda.toBuffer()],
    pid
  )[0];
}

export function getAlpStakingAccountKey(owner: string): PublicKey {
  return getUserStakingPda(
    new PublicKey(owner),
    getStakingPda(new PublicKey(alpMint))
  );
}

export function getAdxStakingAccountKey(owner: string): PublicKey {
  return getUserStakingPda(
    new PublicKey(owner),
    getStakingPda(new PublicKey(adxMint))
  );
}
