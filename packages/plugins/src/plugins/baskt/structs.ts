import {
  array,
  BeetStruct,
  bool,
  FixableBeetStruct,
  u16,
  u8,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type TokenAllocation = {
  token_mint: PublicKey;
  token_decimals: number;
  allocation: number;
  token_price: BigNumber;
  token_balance: BigNumber;
  last_price_update: BigNumber;
};

export const tokenAllocationStruct = new BeetStruct<TokenAllocation>(
  [
    ['token_mint', publicKey],
    ['token_decimals', u8],
    ['allocation', u8],
    ['token_price', u64],
    ['token_balance', u64],
    ['last_price_update', i64],
  ],
  (args) => args as TokenAllocation
);

export type VaultState = {
  buffer: Buffer;
  authority: PublicKey;
  oracle_authority: PublicKey;
  vault_asset_holder: PublicKey;
  vault_bump: number;
  vault_auth_bump: number;
  vault_token_bump: number;
  total_value_in_sol: BigNumber;
  total_supply: BigNumber;
  vault_name: number[];
  vault_version: number;
  paused: boolean;
  deposit_paused: boolean;
  creation_time: BigNumber;
  last_operation_time: BigNumber;
  token_allocations: TokenAllocation[];
  deposit_fees: BigNumber;
  redeem_fees: BigNumber;
};

export const vaultStateStruct = new FixableBeetStruct<VaultState>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['oracle_authority', publicKey],
    ['vault_asset_holder', publicKey],
    ['vault_bump', u8],
    ['vault_auth_bump', u8],
    ['vault_token_bump', u8],
    ['total_value_in_sol', u64],
    ['total_supply', u64],
    ['vault_name', array(u8)],
    ['vault_version', u8],
    ['paused', bool],
    ['deposit_paused', bool],
    ['creation_time', i64],
    ['last_operation_time', i64],
    ['token_allocations', array(tokenAllocationStruct)],
    ['deposit_fees', u16],
    ['redeem_fees', u16],
  ],
  (args) => args as VaultState
);
