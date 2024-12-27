import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export enum State {
  Uninitialized,
  StakePool,
  InactiveStakePool,
  StakeAccount,
}

export type WithdrawalRequest = {
  batch_id: BigNumber;
  request_id: BigNumber;
  receipt_token_amount: BigNumber;
  created_at: BigNumber;
  _reserved: number[];
};

export const withdrawalRequestStruct = new BeetStruct<WithdrawalRequest>(
  [
    ['batch_id', u64],
    ['request_id', u64],
    ['receipt_token_amount', u64],
    ['created_at', i64],
    ['_reserved', uniformFixedSizeArray(u8, 16)],
  ],
  (args) => args as WithdrawalRequest
);

export type UserFundAccount = {
  buffer: Buffer;
  data_version: number;
  bump: number;
  receipt_token_mint: PublicKey;
  user: PublicKey;
  receipt_token_amount: BigNumber;
  _reserved: number[];
  withdrawal_requests: WithdrawalRequest;
};

export const userFundAccountStruct = new BeetStruct<UserFundAccount>(
  [
    ['buffer', blob(8)],
    ['data_version', u16],
    ['bump', u8],
    ['receipt_token_mint', publicKey],
    ['user', publicKey],
    ['receipt_token_amount', u64],
    ['_reserved', uniformFixedSizeArray(u8, 32)],
    ['withdrawal_requests', withdrawalRequestStruct],
  ],
  (args) => args as UserFundAccount
);
