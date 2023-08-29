import { BeetStruct } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type WhirlpoolPosition = {
  buffer: Buffer;
  tokenAMint: PublicKey;
  tokenBMint: PublicKey;
  position: PublicKey;
  whirlpool: PublicKey;
  sharesMint: PublicKey;
  strategyDex: BigNumber;
};

export const whirlpoolPositionStruct = new BeetStruct<WhirlpoolPosition>(
  [
    ['buffer', blob(8)],
    ['tokenAMint', publicKey],
    ['tokenBMint', publicKey],
    ['position', publicKey],
    ['whirlpool', publicKey],
    ['sharesMint', publicKey],
    ['strategyDex', u64],
  ],
  (args) => args as WhirlpoolPosition
);
