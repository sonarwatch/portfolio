import {
  bool,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type StakeV2 = {
  buffer: Buffer;
  bump: number;
  authority: PublicKey;
  init_ts: BigNumber;
  withdraw_ts: BigNumber;
  claimed_ts: BigNumber;
  name: number[];
  mint: PublicKey;
  boost: boolean;
  stake_vault: PublicKey;
  claimCount: BigNumber;
  claimed: BigNumber;
  available: BigNumber;
  amount: BigNumber;
};

export const stakeV2Struct = new FixableBeetStruct<StakeV2>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['authority', publicKey],
    ['init_ts', i64],
    ['withdraw_ts', i64],
    ['claimed_ts', i64],
    ['name', uniformFixedSizeArray(u8, 12)],
    ['mint', publicKey],
    ['boost', bool],
    ['stake_vault', publicKey],
    ['claimCount', u64],
    ['claimed', u64],
    ['available', u64],
    ['amount', u64],
  ],
  (args) => args as StakeV2
);
