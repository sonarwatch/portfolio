import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { LockupKind } from './structs/realms';

export function getVoterPda(
  owner: string,
  registrar: string,
  vsr: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      new PublicKey(registrar).toBuffer(),
      Buffer.from('voter', 'utf-8'),
      new PublicKey(owner).toBuffer(),
    ],
    new PublicKey(vsr)
  )[0];
}

export function getLockedUntil(
  startTs: BigNumber,
  endTs: BigNumber,
  lockupKind: LockupKind
): number | undefined {
  let lockedUntil;
  if (lockupKind === LockupKind.Constant) {
    lockedUntil = endTs.minus(startTs).times(1000).plus(Date.now()).toNumber();
  } else if (
    lockupKind === LockupKind.Cliff ||
    lockupKind === LockupKind.Monthly ||
    lockupKind === LockupKind.Daily
  ) {
    lockedUntil = endTs.times(1000).toNumber();
  }
  return lockedUntil;
}
