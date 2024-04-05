import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { programId } from './constants';

export function getOldLpAccountPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('lp_account', 'utf-8'),
      new PublicKey('82dGS7Jt4Km8ZgwZVRsJ2V6vPXEhVdgDaMP7cqPGG1TW').toBuffer(),
      new PublicKey(owner).toBuffer(),
    ],
    programId
  )[0];
}

export function getLpPositionsPdas(
  owner: string,
  start: number,
  end: number
): PublicKey[] {
  const keys: PublicKey[] = [];
  for (let i = start; i < end; i++) {
    keys.push(
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('lp_position', 'utf-8'),
          new PublicKey(
            '82dGS7Jt4Km8ZgwZVRsJ2V6vPXEhVdgDaMP7cqPGG1TW'
          ).toBuffer(),
          new PublicKey(owner).toBuffer(),
          new BN(i).toArrayLike(Buffer, 'le', 8),
        ],
        programId
      )[0]
    );
  }
  return keys;
}

export function getSettlementRequestsPdas(
  owner: string,
  start: number,
  end: number
): PublicKey[] {
  const keys: PublicKey[] = [];
  for (let i = start; i < end; i++) {
    keys.push(
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('settlement_request', 'utf-8'),
          new PublicKey(owner).toBuffer(),
          new BN(i).toArrayLike(Buffer, 'le', 8),
        ],
        programId
      )[0]
    );
  }
  return keys;
}
