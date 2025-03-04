import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, u64 } from '../../utils/solana';

export type LendingMarket = {
  buffer: Buffer;
  owner: PublicKey;
  owner_cached: PublicKey;
  reserves_count: BigNumber;
};

export const lendingMarketStruct = new BeetStruct<LendingMarket>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['owner_cached', publicKey],
    ['reserves_count', u64],
  ],
  (args) => args as LendingMarket
);

export type DepositPosition = {
  reserve: PublicKey;
  deposited_amount: BigNumber;
  collateral_amount: BigNumber;
  updated_at: BigNumber;
};

export const depositPositionStruct = new BeetStruct<DepositPosition>(
  [
    ['reserve', publicKey],
    ['deposited_amount', u64],
    ['collateral_amount', u64],
    ['updated_at', i64],
  ],
  (args) => args as DepositPosition
);

export type BorrowPosition = {
  reserve: PublicKey;
  borrowed_amount: BigNumber;
  borrowed_collateral_amount: BigNumber;
  updated_at: BigNumber;
};

export const borrowPositionStruct = new BeetStruct<BorrowPosition>(
  [
    ['reserve', publicKey],
    ['borrowed_amount', u64],
    ['borrowed_collateral_amount', u64],
    ['updated_at', i64],
  ],
  (args) => args as BorrowPosition
);

export type Obligation = {
  accountDiscriminator: number[];
  owner: PublicKey;
  lending_market: PublicKey;
  tag: BigNumber;
  deposit_position: DepositPosition;
  borrow_position: BorrowPosition;
};

export const obligationStruct = new BeetStruct<Obligation>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['lending_market', publicKey],
    ['tag', u64],
    ['deposit_position', depositPositionStruct],
    ['borrow_position', borrowPositionStruct],
  ],
  (args) => args as Obligation
);
