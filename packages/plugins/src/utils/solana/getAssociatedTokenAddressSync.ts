import { PublicKey } from '@solana/web3.js';
import { associatedTokenProgramId, solanaTokenPidPk } from './constants';

export default function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): PublicKey | undefined {
  if (!PublicKey.isOnCurve(owner.toBuffer())) return undefined;

  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), solanaTokenPidPk.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId
  )[0];
}
