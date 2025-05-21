import {
  BeetStruct,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { i64, u64 } from '../../utils/solana';

export enum TokenKind {
  Collateral,
  Claim,
  AdapterCollateral,
}

export type AccountPosition = {
  token: PublicKey;
  padding: number[];
  balance: BigNumber;
  padding2: number[];
  kind: TokenKind;
  padding3: number[];
};
export const accountPositionStruct = new BeetStruct<AccountPosition>(
  [
    ['token', publicKey],
    ['padding', uniformFixedSizeArray(u8, 80)],
    ['balance', u64],
    ['padding2', uniformFixedSizeArray(u8, 32)],
    ['kind', u32],
    ['padding3', uniformFixedSizeArray(u8, 36)],
  ],
  (args) => args as AccountPosition
);

export type MarginAccount = {
  accountDiscriminator: number[];
  version: number;
  bump_seed: number[];
  user_seed: number[];
  invocation: number;
  reserved0: number[];
  owner: PublicKey;
  airspace: PublicKey;
  liquidator: PublicKey;
  padding: number[];
  positions: AccountPosition[];
};

export const marginAccountStruct = new BeetStruct<MarginAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['bump_seed', uniformFixedSizeArray(u8, 1)],
    ['user_seed', uniformFixedSizeArray(u8, 2)],
    ['invocation', u8],
    ['reserved0', uniformFixedSizeArray(u8, 3)],
    ['owner', publicKey],
    ['airspace', publicKey],
    ['liquidator', publicKey],
    ['padding', uniformFixedSizeArray(u8, 1288)],
    ['positions', uniformFixedSizeArray(accountPositionStruct, 32)],
  ],
  (args) => args as MarginAccount
);

export type MarginPoolConfig = {
  flags: BigNumber;
  utilization_rate_1: number;
  utilization_rate_2: number;
  borrow_rate_0: number;
  borrow_rate_1: number;
  borrow_rate_2: number;
  borrow_rate_3: number;
  management_fee_rate: number;
  deposit_limit: BigNumber;
  borrow_limit: BigNumber;
  reserved: BigNumber;
};
export const marginPoolConfigStruct = new BeetStruct<MarginPoolConfig>(
  [
    ['flags', u64],
    ['utilization_rate_1', u16],
    ['utilization_rate_2', u16],
    ['borrow_rate_0', u16],
    ['borrow_rate_1', u16],
    ['borrow_rate_2', u16],
    ['borrow_rate_3', u16],
    ['management_fee_rate', u16],
    ['deposit_limit', u64],
    ['borrow_limit', u64],
    ['reserved', u64],
  ],
  (args) => args as MarginPoolConfig
);

export type MarginPool = {
  accountDiscriminator: number[];
  version: number;
  pool_bump: number[];
  airspace: PublicKey;
  vault: PublicKey;
  fee_destination: PublicKey;
  deposit_note_mint: PublicKey;
  loan_note_mint: PublicKey;
  token_mint: PublicKey;
  address: PublicKey;
  config: MarginPoolConfig;
  borrowed_tokens: number[];
  uncollected_fees: number[];
  deposit_tokens: BigNumber;
  deposit_notes: BigNumber;
  loan_notes: BigNumber;
  accrued_until: BigNumber;
};
export const marginPoolStruct = new BeetStruct<MarginPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['pool_bump', uniformFixedSizeArray(u8, 1)],
    ['airspace', publicKey],
    ['vault', publicKey],
    ['fee_destination', publicKey],
    ['deposit_note_mint', publicKey],
    ['loan_note_mint', publicKey],
    ['token_mint', publicKey],
    ['address', publicKey],
    ['config', marginPoolConfigStruct],
    ['borrowed_tokens', uniformFixedSizeArray(u8, 24)],
    ['uncollected_fees', uniformFixedSizeArray(u8, 24)],
    ['deposit_tokens', u64],
    ['deposit_notes', u64],
    ['loan_notes', u64],
    ['accrued_until', i64],
  ],
  (args) => args as MarginPool
);
