import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u64 } from '../../utils/solana';

export type Staked = {
  accountDiscriminator: number[];
  owner: PublicKey;
  pool: PublicKey;
  plan: number;
  stakedAmount: BigNumber;
  stakedAtTimestamp: BigNumber;
  unlockAtTimestamp: BigNumber;
  bump: number;
};

export const stakedStruct = new BeetStruct<Staked>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['pool', publicKey],
    ['plan', u8],
    ['stakedAmount', u64],
    ['stakedAtTimestamp', i64],
    ['unlockAtTimestamp', i64],
    ['bump', u8],
  ],
  (args) => args as Staked
);
