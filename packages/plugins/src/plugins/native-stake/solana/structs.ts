import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, f64, u64 } from '../../../utils/solana';

export type Lockup = {
  unixTimestamp: BigNumber;
  epoch: BigNumber;
  custodian: PublicKey;
};

export const lockupStruct = new BeetStruct<Lockup>(
  [
    ['unixTimestamp', u64],
    ['epoch', u64],
    ['custodian', publicKey],
  ],
  (args) => args as Lockup
);

export enum StakeAccountState {
  uninitialized,
  initialized,
  delegated,
  rewardsPool,
}

export type StakeAccount = {
  state: StakeAccountState;
  buffer1: Buffer;
  rent_exempt_reserve: BigNumber;
  staker: PublicKey;
  withdrawer: PublicKey;
  lockup: Lockup;
  voter: PublicKey;
  stake: BigNumber;
  activation_epoch: BigNumber;
  deactivation_epoch: BigNumber;
  warmup_cooldown_rate: BigNumber;
  credits_observed: BigNumber;
};

export const stakeAccountStruct = new BeetStruct<StakeAccount>(
  [
    ['state', u8],
    ['buffer1', blob(3)],
    ['rent_exempt_reserve', u64],
    ['staker', publicKey],
    ['withdrawer', publicKey],
    ['lockup', lockupStruct],
    ['voter', publicKey],
    ['stake', u64],
    ['activation_epoch', u64],
    ['deactivation_epoch', u64],
    ['warmup_cooldown_rate', f64],
    ['credits_observed', u64],
  ],
  (args) => args as StakeAccount
);
