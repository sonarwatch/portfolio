import {
  BeetStruct,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type User = {
  accountDiscriminator: number[];
  version: number;
  bump: number;
  nick: Buffer;
  owner: PublicKey;
};

export const userStruct = new BeetStruct<User>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['bump', u8],
    ['nick', blob(14)],
    ['owner', publicKey],
  ],
  (args) => args as User
);

export enum LoanStatus {
  Unknown,
  Active,
  Repaid,
  Defaulted,
}

export type Loan = {
  accountDiscriminator: number[];
  version: number;
  _padding0: Uint8Array;
  bulk_uuid: Uint8Array;
  client_loan_id: Uint8Array;
  _padding1: Uint8Array;
  pair: PublicKey;
  apr_bps: number;
  principal: BigNumber;
  collateral: BigNumber;
  duration_sec: BigNumber;
  lender: PublicKey;
  start_time: BigNumber;
  end_time: BigNumber;
  borrower: PublicKey;
  status: LoanStatus;
  _padding2: Uint8Array;
};

export const loanStruct = new BeetStruct<Loan>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['_padding0', blob(7)],
    ['bulk_uuid', blob(16)],
    ['client_loan_id', blob(16)],
    ['_padding1', blob(4)],
    ['pair', publicKey],
    ['apr_bps', u32],
    ['principal', u64],
    ['collateral', u64],
    ['duration_sec', u64],
    ['lender', publicKey],
    ['start_time', u64],
    ['end_time', u64],
    ['borrower', publicKey],
    ['status', u8],
    ['_padding2', blob(32 * 4 * 7)],
  ],
  (args) => args as Loan
);

export type Offer = {
  accountDiscriminator: number[];
  version: number;
  _padding0: Uint8Array;
  pair: PublicKey;
  client_offer_id: Uint8Array;
  principal: BigNumber;
  collateral: BigNumber;
  remaining_principal: BigNumber;
  remaining_collateral: BigNumber;
  lender: PublicKey;
  _padding1: Uint8Array;
};

export const offerStruct = new BeetStruct<Offer>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['_padding0', blob(7)],
    ['pair', publicKey],
    ['client_offer_id', blob(16)],
    ['principal', u64],
    ['collateral', u64],
    ['remaining_principal', u64],
    ['remaining_collateral', u64],
    ['lender', publicKey],
    ['_padding1', blob(32 * 4)],
  ],
  (args) => args as Offer
);
