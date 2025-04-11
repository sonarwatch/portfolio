import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { u64 } from '../../utils/solana';

export type Staked = {
  accountDiscriminator: number[];
  user: PublicKey;
  mint: PublicKey;
  amount: BigNumber;
};

export const stakedStruct = new BeetStruct<Staked>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['user', publicKey],
    ['mint', publicKey],
    ['amount', u64],
  ],
  (args) => args as Staked
);
