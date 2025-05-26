import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  bool,
  u16,
  u8,
  uniformFixedSizeArray,
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
