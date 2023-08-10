import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, f64, u64 } from '../../utils/solana';

export type StakeAccount = {
  state: number;
  buffer1: Buffer;
  rent_exempt_reserve: BigNumber;
  staker: PublicKey;
  withdrawer: PublicKey;
  buffer2: Buffer; // lockup
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
    ['buffer2', blob(48)],
    ['voter', publicKey],
    ['stake', u64],
    ['activation_epoch', u64],
    ['deactivation_epoch', u64],
    ['warmup_cooldown_rate', f64],
    ['credits_observed', u64],
  ],
  (args) => args as StakeAccount
);
