import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type PromotionSeed = {
  bump: BigNumber;
};

const promotionSeedStruct = new BeetStruct<PromotionSeed>(
  [['bump', u64]],
  (args) => args as PromotionSeed
);

export type UserAccount = {
  buffer: Buffer;
  bump: number;
  _padding: number[];
  owner: PublicKey;
  mfi_account: PublicKey;
  solend_obligation: PublicKey;
  promotion_seeds: PromotionSeed[];
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
    ['promotion_seeds', uniformFixedSizeArray(promotionSeedStruct, 4)],
    ['_padding2', uniformFixedSizeArray(u64, 12)],
  ],
  (args) => args as UserAccount
);
