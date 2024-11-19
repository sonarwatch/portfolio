import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import powerUsers from './powerUsers.json';
import { tensorPid } from './constants';

export function ownerHasPowerUserAllocation(owner: string) {
  const users: { [key: string]: number } = powerUsers;
  return users[owner] !== null;
}

export const findMarginPDA = (owner: string) =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from('margin'),
      PublicKey.findProgramAddressSync([], tensorPid)[0].toBytes(),
      new PublicKey(owner).toBytes(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new BN(0).toArrayLike(Uint8Array as any, 'le', 2),
    ],
    tensorPid
  )[0];
