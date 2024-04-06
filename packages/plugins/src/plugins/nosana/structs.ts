import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type Stake = {
  buffer: Buffer;
  amount: BigNumber;
  authorithy: PublicKey;
  duration: BigNumber;
  timeUnstake: BigNumber;
  vault: PublicKey;
  vaultBump: number;
  xNos: BigNumber;
};

export const stakeStruct = new BeetStruct<Stake>(
  [
    ['buffer', blob(8)],
    ['amount', u64],
    ['authorithy', publicKey],
    ['duration', u64],
    ['timeUnstake', i64],
    ['vault', publicKey],
    ['vaultBump', u8],
    ['xNos', u128],
  ],
  (args) => args as Stake
);
