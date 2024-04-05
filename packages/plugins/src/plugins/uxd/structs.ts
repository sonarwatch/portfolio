import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { BeetStruct, bool, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

type StakingAccount = {
  padding: Buffer;
  bump: number;
  isInitialized: boolean;
  user: PublicKey;
  stakingOptionIdentifier: number;
  stakeEndTs: BigNumber;
  stakedAmount: BigNumber;
  rewardAmount: BigNumber;
};

export const stakingAccountStruct = new BeetStruct<StakingAccount>(
  [
    ['padding', blob(8)],
    ['bump', u8],
    ['isInitialized', bool],
    ['user', publicKey],
    ['stakingOptionIdentifier', u8],
    ['stakeEndTs', u64],
    ['stakedAmount', u64],
    ['rewardAmount', u64],
  ],
  (args) => args as StakingAccount,
  'UXD staking'
);
