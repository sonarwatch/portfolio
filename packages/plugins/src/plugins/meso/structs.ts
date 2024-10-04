import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export enum State {
  Uninitialized,
  StakePool,
  InactiveStakePool,
  StakeAccount,
}

export type Liquidity = {
  buffer: Buffer;
  state: State;
  mint: PublicKey;
  owner: PublicKey;
  amountDeposited: BigNumber;
  space: number[];
};

export const liquidityStruct = new BeetStruct<Liquidity>(
  [
    ['buffer', blob(8)],
    ['state', u8],
    ['mint', publicKey],
    ['owner', publicKey],
    ['amountDeposited', u64],
    ['space', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as Liquidity
);
