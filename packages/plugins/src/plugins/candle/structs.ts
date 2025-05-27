import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { i64, u64 } from '../../utils/solana';

export type Withdrawal = {
  discriminator: number[];
  stakePool: PublicKey;
  receiver: PublicKey;
  burned: number;
  startTs: BigNumber;
  endTs: BigNumber;
  claimTs: BigNumber;
  amount: BigNumber;
};

export const withdrawalStruct = new BeetStruct<Withdrawal>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['stakePool', publicKey],
    ['receiver', publicKey],
    ['burned', u8],
    ['startTs', i64],
    ['endTs', i64],
    ['claimTs', i64],
    ['amount', u64],
  ],
  (args) => args as Withdrawal
);
