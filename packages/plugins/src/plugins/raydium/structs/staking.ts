import { BeetStruct } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64 } from '../../../utils/solana';

export type Stake = {
  state: BigNumber;
  poolId: PublicKey;
  stakerOwner: PublicKey;
  depositBalance: BigNumber;
  rewardDebt: BigNumber;
  rewardDebtB: BigNumber;
};

export const stakeStruct = new BeetStruct<Stake>(
  [
    ['state', u64],
    ['poolId', publicKey],
    ['stakerOwner', publicKey],
    ['depositBalance', u64],
    ['rewardDebt', u64],
    ['rewardDebtB', u64],
  ],
  (args) => args as Stake
);
