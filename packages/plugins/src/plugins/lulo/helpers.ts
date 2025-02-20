import { PublicKey } from '@solana/web3.js';
import { luloProgramId } from './constants';

export function getDerivedAccount(owner: string): string {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('flexlend', 'utf8'), new PublicKey(owner).toBuffer()],
    luloProgramId
  )[0].toString();
}

export function isLiftEmpty(authoritySeed: number[]) {
  return (
    authoritySeed.toString() ===
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].toString()
  );
}

export function getDerivedPendingWithdraws(
  owner: string,
  ids: number[]
): PublicKey[] {
  return ids
    .map((id) => {
      if (id === 0) return [];
      const withdrawalIdBuffer = Buffer.alloc(2);
      withdrawalIdBuffer.writeUInt16LE(id);
      return PublicKey.findProgramAddressSync(
        [
          Buffer.from('withdrawal'),
          new PublicKey(owner).toBuffer(),
          withdrawalIdBuffer,
        ],
        luloProgramId
      )[0];
    })
    .flat();
}
