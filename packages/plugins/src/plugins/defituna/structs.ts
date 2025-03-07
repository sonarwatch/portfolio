import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  i32,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u128, u64 } from '../../utils/solana';

export type Lending = {
  buffer: Buffer;
  version: number;
  bump: number[];
  authority: PublicKey;
  poolMint: PublicKey;
  depositedFunds: BigNumber;
  depositedShares: BigNumber;
};

export const lendingStruct = new BeetStruct<Lending>(
  [
    ['buffer', blob(8)],
    ['version', u16],
    ['bump', uniformFixedSizeArray(u8, 1)],
    ['authority', publicKey],
    ['poolMint', publicKey],
    ['depositedFunds', u64],
    ['depositedShares', u64],
  ],
  (args) => args as Lending
);

export type Vault = {
  pubkey: PublicKey;
  buffer: Buffer;
  version: number;
  bump: number[];
  mint: PublicKey;
  depositedFunds: BigNumber;
  depositedShares: BigNumber;
  borrowedFunds: BigNumber;
  borrowedShares: BigNumber;
  unpaidDebtShares: BigNumber;
  interestRate: BigNumber;
  lastUpdateTimestamp: BigNumber;
  supplyLimit: BigNumber;
  supplyApy: BigNumber;
  borrowApy: BigNumber;
};

export const vaultStruct = new BeetStruct<Vault>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['bump', uniformFixedSizeArray(u16, 1)],
    ['mint', publicKey],
    ['depositedFunds', u64],
    ['depositedShares', u64],
    ['borrowedFunds', u64],
    ['borrowedShares', u64],
    ['unpaidDebtShares', u64],
    ['interestRate', u64],
    ['lastUpdateTimestamp', u64],
    ['supplyLimit', u64],
  ],
  (args) => args as Vault
);

export enum TunaPositionStatus {
  Normal,
  Liquidated,
  ClosedByLimitOrder,
}

export type TunaPosition = {
  buffer: Buffer;
  version: number;
  bump: number[];
  authority: PublicKey;
  pool: PublicKey;
  mint_a: PublicKey;
  mint_b: PublicKey;
  position_mint: PublicKey;
  liquidity: BigNumber;
  tick_lower_index: BigNumber;
  tick_upper_index: BigNumber;
  loan_shares_a: BigNumber;
  loan_shares_b: BigNumber;
  loan_funds_a: BigNumber;
  loan_funds_b: BigNumber;
  leftovers_a: BigNumber;
  leftovers_b: BigNumber;
  tick_entry_index: BigNumber;
  tick_stop_loss_index: BigNumber;
  tick_take_profit_index: BigNumber;
  state: TunaPositionStatus;
};

export const tunaPositionStruct = new BeetStruct<TunaPosition>(
  [
    ['buffer', blob(8)],
    ['version', u16],
    ['bump', uniformFixedSizeArray(u8, 1)],
    ['authority', publicKey],
    ['pool', publicKey],
    ['mint_a', publicKey],
    ['mint_b', publicKey],
    ['position_mint', publicKey],
    ['liquidity', u128],
    ['tick_lower_index', i32],
    ['tick_upper_index', i32],
    ['loan_shares_a', u64],
    ['loan_shares_b', u64],
    ['loan_funds_a', u64],
    ['loan_funds_b', u64],
    ['leftovers_a', u64],
    ['leftovers_b', u64],
    ['tick_entry_index', i32],
    ['tick_stop_loss_index', i32],
    ['tick_take_profit_index', i32],
    ['state', u8],
  ],
  (args) => args as TunaPosition
);
