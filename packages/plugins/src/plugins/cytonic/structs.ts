import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { u128, u64 } from '../../utils/solana';

export type ClaimData = {
  discriminator: number[];
  claimId: BigNumber;
  authority: PublicKey;
  vaultData: PublicKey;
  amount: BigNumber;
  claimableAfter: BigNumber;
  bump: number;
};
export const claimDataStruct = new BeetStruct<ClaimData>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['claimId', u128],
    ['authority', publicKey],
    ['vaultData', publicKey],
    ['amount', u64],
    ['claimableAfter', u64],
    ['bump', u8],
  ],
  (args) => args as ClaimData,
  'ClaimData'
);

export type UserData = {
  discriminator: number[];
  depositAmount: BigNumber;
  bump: number;
};
export const userDataStruct = new BeetStruct<UserData>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['depositAmount', u64],
    ['bump', u8],
  ],
  (args) => args as UserData,
  'UserData'
);

export type VaultData = {
  discriminator: number[];
  owner: PublicKey;
  mint: PublicKey;
  vaultAta: PublicKey;
  withdrawDuration: BigNumber;
  isFrozen: boolean;
  totalDeposited: BigNumber;
  bump: number;
};

export const vaultDataStruct = new BeetStruct<VaultData>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['mint', publicKey],
    ['vaultAta', publicKey],
    ['withdrawDuration', u64],
    ['isFrozen', u8],
    ['totalDeposited', u64],
    ['bump', u8],
  ],
  (args) => args as VaultData,
  'VaultData'
);
