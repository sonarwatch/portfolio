import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export function getMerkleDistributorPda(
  base: string,
  mint: string,
  version: number,
  programId: string
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('MerkleDistributor'),
      new PublicKey(base).toBytes(),
      new PublicKey(mint).toBytes(),
      new BN(version).toArrayLike(Buffer, 'le', 8),
    ],
    new PublicKey(programId)
  )[0];
}
