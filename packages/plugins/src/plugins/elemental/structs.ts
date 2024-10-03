import { BeetStruct, u32, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export enum State {
  Uninitialized,
  StakePool,
  InactiveStakePool,
  StakeAccount,
}

export type Pool = {
  buffer: Buffer;
  liquidity_mint: PublicKey;
  liquidity_holder: PublicKey;
  per_token_amount: BigNumber;
  max_deposit_amount: BigNumber;
  min_deposit_amount: BigNumber;
  max_supply: BigNumber;
  current_supply: BigNumber;
  next_supply: BigNumber;
  reward_per_token: BigNumber;
  reward_annual_rate: BigNumber;
  deactivating_amount_n0: BigNumber;
  claiming_amount_n0: BigNumber;
  deactivating_amount_n1: BigNumber;
  claiming_amount_n1: BigNumber;
  pending_amount: BigNumber;
  epoch_duration: number;
  epoch_index: number;
  epoch_start_time: number;
  authority_bump: number;
  admin: PublicKey;
  pending_admin: PublicKey;
};

export const poolStruct = new BeetStruct<Pool>(
  [
    ['buffer', blob(8)],
    ['liquidity_mint', publicKey],
    ['liquidity_holder', publicKey],
    ['per_token_amount', u64],
    ['max_deposit_amount', u64],
    ['min_deposit_amount', u64],
    ['max_supply', u64],
    ['current_supply', u64],
    ['next_supply', u64],
    ['reward_per_token', u64],
    ['reward_annual_rate', u64],
    ['deactivating_amount_n0', u64],
    ['claiming_amount_n0', u64],
    ['deactivating_amount_n1', u64],
    ['claiming_amount_n1', u64],
    ['pending_amount', u64],
    ['epoch_duration', u32],
    ['epoch_index', u32],
    ['epoch_start_time', u32],
    ['authority_bump', u8],
    ['admin', publicKey],
    ['pending_admin', publicKey],
  ],
  (args) => args as Pool
);

export type Position = {
  buffer: Buffer;
  pool: PublicKey;
  owner: PublicKey;
  reward_before_deposit: BigNumber;
  reward_earned: BigNumber;
  reward_claimed: BigNumber;
  amount: BigNumber;
  deactivating_amount: BigNumber;
  claiming_amount: BigNumber;
  last_updated_epoch_index: number;
};

export const positionStruct = new BeetStruct<Position>(
  [
    ['buffer', blob(8)],
    ['pool', publicKey],
    ['owner', publicKey],
    ['reward_before_deposit', u64],
    ['reward_earned', u64],
    ['reward_claimed', u64],
    ['amount', u64],
    ['deactivating_amount', u64],
    ['claiming_amount', u64],
    ['last_updated_epoch_index', u32],
  ],
  (args) => args as Position
);
