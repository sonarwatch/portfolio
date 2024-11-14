import { BeetStruct } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type Deposit = {
  buffer: Buffer;
  deposit: BigNumber;
  depositInitial: BigNumber;
  startTs: BigNumber;
  endTs: BigNumber;
  owner: PublicKey;
};

export const depositStruct = new BeetStruct<Deposit>(
  [
    ['buffer', blob(8)],
    ['deposit', u64],
    ['depositInitial', u64],
    ['startTs', u64],
    ['endTs', u64],
    ['owner', publicKey],
  ],
  (args) => args as Deposit
);
