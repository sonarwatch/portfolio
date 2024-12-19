import { BeetStruct } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type PoolStake = {
  buffer: Buffer;
  authority: PublicKey;
  balance: BigNumber;
  mint: PublicKey;
  pool: PublicKey;
};

export const poolStakeStruct = new BeetStruct<PoolStake>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['balance', u64],
    ['mint', publicKey],
    ['pool', publicKey],
  ],
  (args) => args as PoolStake
);
