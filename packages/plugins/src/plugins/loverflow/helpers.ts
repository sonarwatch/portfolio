import { PublicKey } from '@solana/web3.js';

export function getPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [new PublicKey(owner).toBuffer().slice(0, 31)],
    new PublicKey('CChTq6PthWU82YZkbveA3WDf7s97BWhBK4Vx9bmsT743')
  )[0];
}
