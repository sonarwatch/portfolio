import { PublicKey } from '@solana/web3.js';
import { distributorPid, receiptBuffer } from './constants';

export function getEvmReceiptPdaBySeason(
  owner: string,
  season: number
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      receiptBuffer,
      Uint8Array.from([season]),
      Buffer.from(owner.slice(2), 'hex'),
    ],
    distributorPid
  )[0];
}

export function getSolReceiptPdaBySeason(
  owner: string,
  season: number
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [receiptBuffer, Uint8Array.from([season]), new PublicKey(owner).toBytes()],
    distributorPid
  )[0];
}
