import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type LpAccount = {
  buffer: Buffer;
  liquidity: BigNumber;
  shares: BigNumber;
  lastAddLiquidityTimestamp: BigNumber;
  exchange: PublicKey;
  owner: PublicKey;
  delegate: PublicKey;
  bump: number;
  padding: number[];
};

export const lpAccountStruct = new BeetStruct<LpAccount>(
  [
    ['buffer', blob(8)],
    ['liquidity', u64],
    ['shares', u64],
    ['lastAddLiquidityTimestamp', u64],
    ['exchange', publicKey],
    ['owner', publicKey],
    ['delegate', publicKey],
    ['bump', u8],
    ['padding', uniformFixedSizeArray(u8, 7)],
  ],
  (args) => args as LpAccount
);
