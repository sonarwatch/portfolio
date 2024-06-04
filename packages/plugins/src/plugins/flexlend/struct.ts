import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type PromotionSeed = {
  authoritySeed: number[];
  padding: number[];
};

const promotionSeedStruct = new BeetStruct<PromotionSeed>(
  [
    ['authoritySeed', uniformFixedSizeArray(u8, 19)],
    ['padding', uniformFixedSizeArray(u8, 13)],
  ],
  (args) => args as PromotionSeed
);

export type UserAccount = {
  buffer: Buffer;
  bump: number;
  _padding: number[];
  owner: PublicKey;
  mfi_account: PublicKey;
  solend_obligation: PublicKey;
  promotionSeeds: PromotionSeed[];
  _padding2: BigNumber[];
};

export const userAccountStruct = new BeetStruct<UserAccount>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['_padding', uniformFixedSizeArray(u8, 7)],
    ['owner', publicKey],
    ['mfi_account', publicKey],
    ['solend_obligation', publicKey],
    ['promotionSeeds', uniformFixedSizeArray(promotionSeedStruct, 4)],
    ['_padding2', uniformFixedSizeArray(u64, 12)],
  ],
  (args) => args as UserAccount
);

export type PromotionAuthority = {
  buffer: Buffer;
  bump: number;
  authoritySeed: number[];
  padding1: PublicKey;
  mintAddress: PublicKey;
  userAccount: PublicKey;
  totalDeposits: BigNumber;
  padding2: BigNumber[];
};

export const promotionAuthorityStruct = new BeetStruct<PromotionAuthority>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['authoritySeed', uniformFixedSizeArray(u8, 19)],
    ['padding1', uniformFixedSizeArray(u8, 12)],
    ['mintAddress', publicKey],
    ['userAccount', publicKey],
    ['totalDeposits', u64],
    ['padding2', uniformFixedSizeArray(u64, 8)],
  ],
  (args) => args as PromotionAuthority
);
