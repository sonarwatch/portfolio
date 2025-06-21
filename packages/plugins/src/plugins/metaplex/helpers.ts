import { PublicKey } from '@solana/web3.js';
import { metadataProgram } from './constants';

export function getEditionPubkeyOfNft(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      metadataProgram.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    metadataProgram
  )[0];
}

export function getMetadataPubkey(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), metadataProgram.toBuffer(), mint.toBuffer()],
    metadataProgram
  )[0];
}
