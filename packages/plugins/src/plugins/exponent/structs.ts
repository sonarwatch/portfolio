import BigNumber from 'bignumber.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type YieldTokenPosition = {
  buffer: Buffer;
  owner: PublicKey;
  vault: PublicKey;
  yt_balance: BigNumber;
};

export const yieldTokenStruct = new BeetStruct<YieldTokenPosition>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['vault', publicKey],
    ['yt_balance', u64],
  ],
  (args) => args as YieldTokenPosition
);

export type LpPosition = {
  buffer: Buffer;
  owner: PublicKey;
  market: PublicKey;
  lp_balance: BigNumber;
};

export const lpPositionStruct = new BeetStruct<LpPosition>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['market', publicKey],
    ['lp_balance', u64],
  ],
  (args) => args as LpPosition
);
