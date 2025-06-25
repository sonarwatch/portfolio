import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  bool,
  u16,
  u8,
  uniformFixedSizeArray,
  FixableBeetStruct,
  FixableBeetArgsStruct,
  DataEnumKeyAsKind,
  dataEnum,
  FixableBeet,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type TokenBalance = {
  buffer: Buffer;
  init: boolean;
  bump: number;
  balance: BigNumber;
  rentPayer: PublicKey;
};

export const tokenBalanceStruct = new BeetStruct<TokenBalance>(
  [
    ['buffer', blob(8)],
    ['init', bool],
    ['bump', u8],
    ['balance', u64],
    ['rentPayer', publicKey],
  ],
  (args) => args as TokenBalance
);

export type StakeAccountMetadata = {
  accountDiscriminator: number[];
  metadata_bump: number;
  custody_bump: number;
  authority_bump: number;
  recorded_balance: BigNumber;
  recorded_vesting_balance: BigNumber;
  owner: PublicKey;
  delegate: PublicKey;
  stake_account_checkpoints_last_index: number;
};

export const stakeAccountMetadataStruct = new BeetStruct<StakeAccountMetadata>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['metadata_bump', u8],
    ['custody_bump', u8],
    ['authority_bump', u8],
    ['recorded_balance', u64],
    ['recorded_vesting_balance', u64],
    ['owner', publicKey],
    ['delegate', publicKey],
    ['stake_account_checkpoints_last_index', u16],
  ],
  (args) => args as StakeAccountMetadata
);

// -------------------- Identity Enum --------------------
type IdentityRecord = {
  Discord: { username: number[] };
  Solana: { pubkey: number[] };
  Evm: { pubkey: number[] };
  Sui: { address: number[] };
  Aptos: { address: number[] };
  Cosmwasm: { address: number[] };
  Injective: { address: number[] };
  Algorand: { pubkey: number[] };
};
export type Identity = DataEnumKeyAsKind<IdentityRecord>;

export const identityStruct = dataEnum<IdentityRecord>([
  [
    'Discord',
    new FixableBeetArgsStruct<IdentityRecord['Discord']>(
      [['username', uniformFixedSizeArray(u8, 20)]],
      'IdentityRecord["Discord"]'
    ),
  ],
  [
    'Solana',
    new FixableBeetArgsStruct<IdentityRecord['Solana']>(
      [['pubkey', uniformFixedSizeArray(u8, 32)]],
      'IdentityRecord["Solana"]'
    ),
  ],
  [
    'Evm',
    new FixableBeetArgsStruct<IdentityRecord['Evm']>(
      [['pubkey', uniformFixedSizeArray(u8, 20)]],
      'IdentityRecord["Evm"]'
    ),
  ],
  [
    'Sui',
    new FixableBeetArgsStruct<IdentityRecord['Sui']>(
      [['address', uniformFixedSizeArray(u8, 32)]],
      'IdentityRecord["Sui"]'
    ),
  ],
  [
    'Aptos',
    new FixableBeetArgsStruct<IdentityRecord['Aptos']>(
      [['address', uniformFixedSizeArray(u8, 32)]],
      'IdentityRecord["Aptos"]'
    ),
  ],
  [
    'Cosmwasm',
    new FixableBeetArgsStruct<IdentityRecord['Cosmwasm']>(
      [['address', uniformFixedSizeArray(u8, 20)]],
      'IdentityRecord["Cosmwasm"]'
    ),
  ],
  [
    'Injective',
    new FixableBeetArgsStruct<IdentityRecord['Injective']>(
      [['address', uniformFixedSizeArray(u8, 20)]],
      'IdentityRecord["Injective"]'
    ),
  ],
  [
    'Algorand',
    new FixableBeetArgsStruct<IdentityRecord['Algorand']>(
      [['pubkey', uniformFixedSizeArray(u8, 32)]],
      'IdentityRecord["Algorand"]'
    ),
  ],
]) as FixableBeet<Identity>;

// -------------------- ClaimInfo Struct --------------------
export type ClaimInfo = {
  discriminator: number[];
  identity: Identity;
  amount: BigNumber;
};

export const claimInfoStruct = new FixableBeetStruct<ClaimInfo>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['identity', identityStruct],
    ['amount', u64],
  ],
  (args) => args as ClaimInfo
);
