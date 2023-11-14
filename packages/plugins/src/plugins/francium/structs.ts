import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type RewardAccount = {
  // buffer: Buffer;
  version: number;
  staked_amount: BigNumber;
  rewards_debt: BigNumber;
  rewards_debt_b: BigNumber;
  farming_pool: PublicKey;
  user_main: PublicKey;
  stake_token_account: PublicKey;
  rewards_token_account: PublicKey;
  rewards_token_account_b: PublicKey;
  padding: Buffer;
};

export const rewardAccountStruct = new BeetStruct<RewardAccount>(
  [
    // ['buffer', blob(8)],
    ['version', u8],
    ['staked_amount', u64],
    ['rewards_debt', u64],
    ['rewards_debt_b', u64],
    ['farming_pool', publicKey],
    ['user_main', publicKey],
    ['stake_token_account', publicKey],
    ['rewards_token_account', publicKey],
    ['rewards_token_account_b', publicKey],
    ['padding', blob(128)],
  ],
  (args) => args as RewardAccount
);
