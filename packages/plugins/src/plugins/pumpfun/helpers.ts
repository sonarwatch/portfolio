import { PublicKey } from '@solana/web3.js';
import { programId, swapProgramId } from './constants';
import { associatedTokenProgramId, solanaTokenPidPk } from '../../utils/solana';

export function coinCreatorVaultAuthorityPda(coinCreator: PublicKey) {
  const [coinCreatorVaultAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('creator_vault'), coinCreator.toBuffer()],
    swapProgramId
  );
  return coinCreatorVaultAuthority;
}

export function creatorVaultPda(creator: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('creator-vault'), creator.toBuffer()],
    programId
  )[0];
}

export function coinCreatorVaultAta(
  coinCreatorVaultAuthority: PublicKey,
  quoteMint: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [
      coinCreatorVaultAuthority.toBuffer(),
      solanaTokenPidPk.toBuffer(),
      quoteMint.toBuffer(),
    ],
    associatedTokenProgramId
  )[0];
}
