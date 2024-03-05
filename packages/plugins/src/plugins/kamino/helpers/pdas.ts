import { PublicKey } from '@solana/web3.js';
import {
  klendProgramId,
  mainMarket,
  leveragePairs,
  multiplyPairs,
} from '../constants';

export function getLendingPda(owner: string, markets: string[]): PublicKey[] {
  return markets.map(
    (market) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from([0]),
          Buffer.from([0]),
          new PublicKey(owner).toBuffer(),
          new PublicKey(market).toBuffer(),
          PublicKey.default.toBuffer(),
          PublicKey.default.toBuffer(),
        ],
        klendProgramId
      )[0]
  );
}

export function getMultiplyPdas(owner: string): PublicKey[] {
  return multiplyPairs.map(
    (tokens) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from([1]),
          Buffer.from([0]),
          new PublicKey(owner).toBuffer(),
          new PublicKey(mainMarket).toBuffer(),
          new PublicKey(tokens[0]).toBuffer(),
          new PublicKey(tokens[1]).toBuffer(),
        ],
        klendProgramId
      )[0]
  );
}

export function getLeveragePdas(owner: string): PublicKey[] {
  return leveragePairs.map(
    (tokens) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from([3]),
          Buffer.from([0]),
          new PublicKey(owner).toBuffer(),
          new PublicKey(mainMarket).toBuffer(),
          new PublicKey(tokens[0]).toBuffer(),
          new PublicKey(tokens[1]).toBuffer(),
        ],
        klendProgramId
      )[0]
  );
}
