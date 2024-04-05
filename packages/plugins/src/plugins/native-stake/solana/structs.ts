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
  buffer: Buffer;
  rentExemptReserve: BigNumber;
  staker: PublicKey;
  withdrawer: PublicKey;
  lockup: Lockup;
  voter: PublicKey;
  stake: BigNumber;
  activationEpoch: BigNumber;
  deactivationEpoch: BigNumber;
  warmupCooldownRate: BigNumber;
  creditsObserved: BigNumber;
};

export const stakeAccountStruct = new BeetStruct<StakeAccount>(
  [
    ['state', u8],
    ['buffer', blob(3)],
    ['rentExemptReserve', u64],
    ['staker', publicKey],
    ['withdrawer', publicKey],
    ['lockup', lockupStruct],
    ['voter', publicKey],
    ['stake', u64],
    ['activationEpoch', u64],
    ['deactivationEpoch', u64],
    ['warmupCooldownRate', f64],
    ['creditsObserved', u64],
  ],
  (args) => args as StakeAccount
);
