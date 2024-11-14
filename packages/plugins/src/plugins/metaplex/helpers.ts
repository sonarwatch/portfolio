import { PublicKey } from '@solana/web3.js';
import { metadatProgram } from './constants';

export function getEditionPubkeyOfNft(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      metadatProgram.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    metadatProgram
  )[0];
}

export function getMetadataPubkey(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), metadatProgram.toBuffer(), mint.toBuffer()],
    metadatProgram
  )[0];
}
