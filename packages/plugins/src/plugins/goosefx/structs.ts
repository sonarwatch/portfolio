import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type Liquidity = {
  buffer: Buffer;
  poolRegistry: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amountDeposited: BigNumber;
  lastObservedTap: BigNumber;
  lastClaimed: BigNumber;
  totalEarned: BigNumber;
  createdAt: BigNumber;
  space: number[];
};

export const liquidityStruct = new BeetStruct<Liquidity>(
  [
    ['buffer', blob(8)],
    ['poolRegistry', publicKey],
    ['mint', publicKey],
    ['owner', publicKey],
    ['amountDeposited', u64],
    ['lastObservedTap', u64],
    ['lastClaimed', i64],
    ['totalEarned', u64],
    ['createdAt', i64],
    ['space', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as Liquidity
);
