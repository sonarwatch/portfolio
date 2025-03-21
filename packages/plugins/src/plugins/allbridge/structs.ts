import { PublicKey } from '@solana/web3.js';
import {
  u8,
  FixableBeetStruct,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';

export type UserDeposit = {
  accountDiscriminator: number[];
  userAddress: PublicKey;
  mint: PublicKey;
  lpAmount: BigNumber;
  rewardDebt: BigNumber;
};

export const userDepositStruct = new FixableBeetStruct<UserDeposit>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['userAddress', publicKey],
    ['mint', publicKey],
    ['lpAmount', u64],
    ['rewardDebt', u64],
  ],
  (args) => args as UserDeposit
);
