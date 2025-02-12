import { PublicKey } from '@solana/web3.js';
import { klendProgramId, mainMarket, lendingConfigs } from '../constants';

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

export function getMultiplyPdas(owner: string, markets: string[]): PublicKey[] {
  return markets
    .map((market) => {
      const config = lendingConfigs.get(market);
      if (!config || !config.multiplyPairs) return [];

      return config.multiplyPairs.map(
        (pair) =>
          PublicKey.findProgramAddressSync(
            [
              Buffer.from([1]),
              Buffer.from([0]),
              new PublicKey(owner).toBuffer(),
              new PublicKey(market).toBuffer(),
              new PublicKey(pair[0]).toBuffer(),
              new PublicKey(pair[1]).toBuffer(),
            ],
            klendProgramId
          )[0]
      );
    })
    .flat();
}

export function getLeveragePdas(owner: string): PublicKey[] {
  const mainMarketConfig = lendingConfigs.get(mainMarket);
  if (!mainMarketConfig) return [];

  const { leveragePairs } = mainMarketConfig;
  if (!leveragePairs) return [];

  return leveragePairs
    .map((tokens) => [
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
      )[0],
      PublicKey.findProgramAddressSync(
        [
          Buffer.from([3]),
          Buffer.from([0]),
          new PublicKey(owner).toBuffer(),
          new PublicKey(mainMarket).toBuffer(),
          new PublicKey(tokens[1]).toBuffer(),
          new PublicKey(tokens[0]).toBuffer(),
        ],
        klendProgramId
      )[0],
    ])
    .flat();
}
