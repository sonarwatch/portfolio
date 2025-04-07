import { PublicKey } from '@solana/web3.js';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

export type Escrow = {
  accountDiscriminator: number[];
  locker: PublicKey;
  owner: PublicKey;
  bump: number;
  tokens: PublicKey;
  amount: BigNumber;
};

export const escrowStruct = new BeetStruct<Escrow>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['locker', publicKey],
    ['owner', publicKey],
    ['bump', u8],
    ['tokens', publicKey],
    ['amount', u64],
  ],
  (args) => args as Escrow
);
