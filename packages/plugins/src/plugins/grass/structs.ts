import {
  BeetStruct,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u128, u64 } from '../../utils/solana';

export type UnstakeRequest = {
  staking_pool_key: PublicKey;
  withdrawal_amount: BigNumber;
  request_time: BigNumber;
  cooldown_end_time: BigNumber;
  _padding: number[];
};

export const unstakeRequestStruct = new BeetStruct<UnstakeRequest>(
  [
    ['staking_pool_key', publicKey],
    ['withdrawal_amount', u64],
    ['request_time', u64],
    ['cooldown_end_time', u64],
    ['_padding', uniformFixedSizeArray(u8, 8)],
  ],
  (args) => args as UnstakeRequest
);

export type Deposit = {
  staking_pool_key: PublicKey;
  pool_multiplier: BigNumber;
  amount_staked: BigNumber;
  accrued_rewards: BigNumber;
};

export const depositStruct = new BeetStruct<Deposit>(
  [
    ['staking_pool_key', publicKey],
    ['pool_multiplier', u128],
    ['amount_staked', u64],
    ['accrued_rewards', u64],
  ],
  (args) => args as Deposit
);

export type UserStakeInfo = {
  buffer: Buffer;
  unstake_requests: UnstakeRequest[];
  deposits: Deposit[];
  amount_staked: BigNumber;
  bump: number;
  _padding: number[];
};

export const userStakeInfoStruct = new FixableBeetStruct<UserStakeInfo>(
  [
    ['buffer', blob(8)],
    ['unstake_requests', uniformFixedSizeArray(unstakeRequestStruct, 20)],
    ['deposits', uniformFixedSizeArray(depositStruct, 20)],
    ['amount_staked', u64],
    ['bump', u8],
    ['_padding', uniformFixedSizeArray(u8, 7)],
  ],
  (args) => args as UserStakeInfo
);
