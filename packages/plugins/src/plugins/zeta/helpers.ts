import { PublicKey } from '@solana/web3.js';

export function getCrossMarginAccount(
  programId: PublicKey,
  userKey: PublicKey,
  seedNumber: number
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('cross-margin', 'utf-8'),
      userKey.toBuffer(),
      Uint8Array.from([seedNumber]),
    ],
    programId
  )[0];
}

export function getMarginAccount(
  programId: PublicKey,
  zetaGroup: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('margin', 'utf-8'), zetaGroup.toBuffer(), userKey.toBuffer()],
    programId
  );
}

export function getCrossMarginAccounts(
  programId: PublicKey,
  owner: PublicKey,
  startId: number,
  endId: number
): PublicKey[] {
  const keys = [];
  for (let i = startId; i < endId; i++) {
    keys.push(getCrossMarginAccount(programId, owner, i));
  }
  return keys;
}
