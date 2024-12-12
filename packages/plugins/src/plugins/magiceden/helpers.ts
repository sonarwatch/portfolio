import { PublicKey } from '@solana/web3.js';
import { m2AuctionHouse, m2Prefix, m2Program, stakingPid } from './constants';

export function getEscrowAccount(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(m2Prefix),
      m2AuctionHouse.toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    m2Program
  )[0];
}

export function getStakingAccount(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('lockup'),
      new PublicKey('acAvyneD7adS3yrXUp41c1AuoYoYRhnjeAWH9stbdTf').toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    stakingPid
  )[0];
}
