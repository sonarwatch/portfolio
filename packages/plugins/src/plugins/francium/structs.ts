import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type LendingPool = {
  version: number;
  last_update_stale: number;
  liquidity_mint_decimals: number;
  threshold_1: number;
  threshold_2: number;
  base_1: number;
  base_2: number;
  base_3: number;
  interest_reverse_rate: number;
  last_update_slot: BigNumber;
  liquidity_available_amount: BigNumber;
  accumulated_interest_reverse: BigNumber;
  factor_1: number;
  factor_2: number;
  factor_3: number;
  lending_market: PublicKey;
  liquidity_mint_pubkey: PublicKey;
  liquidity_supply_pubkey: PublicKey;
  liquidity_fee_receiver: PublicKey;
  oracle: number[];
  liquidity_borrowed_amount_wads: Buffer;
  liquidity_cumulative_borrow_rate_wads: Buffer;
  liquidity_market_price: Buffer;
  share_mint_pubkey: PublicKey;
  share_mint_total_supply: Buffer;
  share_supply_pubkey: PublicKey;
  credit_mint_pubkey: PublicKey;
  credit_mint_total_supply: Buffer;
  credit_supply_pubkey: PublicKey;
};

export const lendingPoolStruct = new BeetStruct<LendingPool>(
  [
    ['version', u8],
    ['last_update_slot', u64],
    ['last_update_stale', u8],
    ['lending_market', publicKey],
    ['liquidity_mint_pubkey', publicKey],
    ['liquidity_mint_decimals', u8],
    ['liquidity_supply_pubkey', publicKey],
    ['liquidity_fee_receiver', publicKey],
    ['oracle', uniformFixedSizeArray(u8, 36)],
    ['liquidity_available_amount', u64],
    ['liquidity_borrowed_amount_wads', blob(16)],
    ['liquidity_cumulative_borrow_rate_wads', blob(16)],
    ['liquidity_market_price', blob(8)],
    ['share_mint_pubkey', publicKey],
    ['share_mint_total_supply', blob(8)],
    ['share_supply_pubkey', publicKey],
    ['credit_mint_pubkey', publicKey],
    ['credit_mint_total_supply', blob(8)],
    ['credit_supply_pubkey', publicKey],
    ['threshold_1', u8],
    ['threshold_2', u8],
    ['base_1', u8],
    ['factor_1', u16],
    ['base_2', u8],
    ['factor_2', u16],
    ['base_3', u8],
    ['factor_3', u16],
    ['interest_reverse_rate', u8],
    ['accumulated_interest_reverse', u64],
  ],
  (args) => args as LendingPool
);

export type RewardUser = {
  version: number;
  staked_amount: BigNumber;
  rewards_debt: BigNumber;
  rewards_debt_b: BigNumber;
  farming_pool: PublicKey;
  user_main: PublicKey;
  stake_token_account: PublicKey;
  rewards_token_accont: PublicKey;
  rewards_token_account_b: PublicKey;
};

export const rewardUserStruct = new BeetStruct<RewardUser>(
  [
    ['version', u8],
    ['staked_amount', u64],
    ['rewards_debt', u64],
    ['rewards_debt_b', u64],
    ['farming_pool', publicKey],
    ['user_main', publicKey],
    ['stake_token_account', publicKey],
    ['rewards_token_accont', publicKey],
    ['rewards_token_account_b', publicKey],
  ],
  (args) => args as RewardUser
);

export interface LendRewardInfo {
  programId: PublicKey;
  farmingPoolAccount: PublicKey;
  farmingPoolAuthority: PublicKey;
  farmingPoolStakeTknMint: PublicKey;
  farmingPoolStakeTknAccount: PublicKey;
  farmingPoolRewardsTknMint: PublicKey;
  farmingPoolRewardsTknAccount: PublicKey;
  farmingPoolRewardsTknMintB: PublicKey;
  farmingPoolRewardsTknAccountB: PublicKey;
}
