import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  u8,
  FixableBeetStruct,
  uniformFixedSizeArray,
  COption,
  coption,
  u16,
  BeetStruct,
  i32,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { f64, i64, u128, u64 } from '../../utils/solana';

export enum LendOfferStatus {
  Created = 0,
  Canceling = 1,
  Canceled = 2,
  Loaned = 3,
}

export enum LoanOfferStatus {
  Matched = 0,
  FundTransferred = 1,
  Repay = 2,
  BorrowerPaid = 3,
  Liquidating = 4,
  Liquidated = 5,
  Finished = 6,
}

export type LendOfferAccount = {
  accountDiscriminator: number[];
  interest: number;
  lenderFeePercent: number;
  duration: BigNumber;
  offerIdsLength: number[];
  offerId: number[];
  lender: PublicKey;
  lendMintToken: PublicKey;
  amount: BigNumber;
  bump: number;
  status: LendOfferStatus;
};

export const lendOfferAccountStruct = new BeetStruct<LendOfferAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['interest', u16],
    ['lenderFeePercent', f64],
    ['duration', u64],
    ['offerIdsLength', uniformFixedSizeArray(u8, 4)],
    ['offerId', uniformFixedSizeArray(u8, 32)],
    ['lender', publicKey],
    ['lendMintToken', publicKey],
    ['amount', u64],
    ['bump', u8],
    ['status', u8],
  ],
  (args) => args as LendOfferAccount
);

export type LoanOfferAccount = {
  accountDiscriminator: number[];
  tierId: number[];
  lendOfferId: number[];
  interest: number;
  borrowAmount: BigNumber;
  lenderFeePercent: number;
  duration: BigNumber;
  lendMintToken: PublicKey;
  lender: PublicKey;
  offerId: number[];
  borrower: PublicKey;
  collateralMintToken: PublicKey;
  collateralAmount: BigNumber;
  requestWithdrawAmount: COption<BigNumber>;
  status: LoanOfferStatus;
  borrowerFeePercent: number;
  startedAt: BigNumber;
  liquidatingAt: COption<BigNumber>;
  liquidatingPrice: COption<number>;
  liquidatedTx: COption<number[]>;
  liquidatedPrice: COption<BigNumber>;
  bump: number;
};

export const loanOfferAccountStruct = new FixableBeetStruct<LoanOfferAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['tierId', uniformFixedSizeArray(u8, 30)],
    ['lendOfferId', uniformFixedSizeArray(u8, 30)],
    ['interest', f64],
    ['borrowAmount', u64],
    ['lenderFeePercent', f64],
    ['duration', u64],
    ['lendMintToken', publicKey],
    ['lender', publicKey],
    ['offerId', uniformFixedSizeArray(u8, 30)],
    ['borrower', publicKey],
    ['collateralMintToken', publicKey],
    ['collateralAmount', u64],
    ['requestWithdrawAmount', coption(u64)],
    ['status', u8],
    ['borrowerFeePercent', f64],
    ['startedAt', i64],
    ['liquidatingAt', i64],
    ['liquidatingPrice', f64],
    ['liquidatedTx', uniformFixedSizeArray(u8, 30)],
    ['liquidatedPrice', u64],
    ['bump', u8],
  ],
  (args) => args as LoanOfferAccount
);

export type UserPosition = {
  accountDiscriminator: number[];
  bump: number;
  protocol_position: PublicKey;
  owner: PublicKey;
  liquidity: BigNumber;
  fee_growth_inside_0: BigNumber;
  fee_growth_inside_1: BigNumber;
  token_fee_owed_0: BigNumber;
  token_fee_owed_1: BigNumber;
  token_fee_claimed_0: BigNumber;
  token_fee_claimed_1: BigNumber;
  version: BigNumber;
  padding: BigNumber[];
};

export const userPositionStruct = new BeetStruct<UserPosition>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['protocol_position', publicKey],
    ['owner', publicKey],
    ['liquidity', u128],
    ['fee_growth_inside_0', u128],
    ['fee_growth_inside_1', u128],
    ['token_fee_owed_0', u64],
    ['token_fee_owed_1', u64],
    ['token_fee_claimed_0', u64],
    ['token_fee_claimed_1', u64],
    ['version', u64],
    ['padding', uniformFixedSizeArray(u64, 6)],
  ],
  (args) => args as UserPosition
);

export type PositionRewardInfo = {
  reward_growth_inside: BigNumber;
  reward_amount_owed: BigNumber;
  reward_vault: PublicKey | null;
};

export const positionRewardInfoStruct = new BeetStruct<PositionRewardInfo>(
  [
    ['reward_growth_inside', u128],
    ['reward_amount_owed', u64],
    ['reward_vault', publicKey],
  ],
  (args) => args as PositionRewardInfo
);

export enum ProtocolPositionStatus {
  Active = 0,
  ReBalancing = 1,
  ReOpened = 2,
}

export type ProtocolPosition = {
  accountDiscriminator: number[];
  bump: number;
  system_config: PublicKey;
  position_mint: PublicKey;
  pool_address: PublicKey;
  tick_lower_index: number;
  tick_upper_index: number;
  liquidity: BigNumber;
  fee_growth_inside_0: BigNumber;
  fee_growth_inside_1: BigNumber;
  amount_0_reserve: BigNumber;
  amount_1_reserve: BigNumber;
  token_vault_0: PublicKey;
  token_vault_1: PublicKey;
  reward_infos: PositionRewardInfo[];
  recent_epoch: BigNumber;
  authority_position: PublicKey;
  status: ProtocolPositionStatus;
  version: BigNumber;
  old_liquidity: BigNumber;
  padding: BigNumber[];
};

export const protocolPositionStruct = new BeetStruct<ProtocolPosition>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['system_config', publicKey],
    ['position_mint', publicKey],
    ['pool_address', publicKey],
    ['tick_lower_index', i32],
    ['tick_upper_index', i32],
    ['liquidity', u128],
    ['fee_growth_inside_0', u128],
    ['fee_growth_inside_1', u128],
    ['amount_0_reserve', u64],
    ['amount_1_reserve', u64],
    ['token_vault_0', publicKey],
    ['token_vault_1', publicKey],
    ['reward_infos', uniformFixedSizeArray(positionRewardInfoStruct, 3)],
    ['recent_epoch', u64],
    ['authority_position', publicKey],
    ['status', u8],
    ['version', u64],
    ['old_liquidity', u128],
    ['padding', uniformFixedSizeArray(u64, 4)],
  ],
  (args) => args as ProtocolPosition
);

export type ProtocolPositionState = {
  accountDiscriminator: number[];
  bump: number;
  pool_id: PublicKey;
  tick_lower_index: number;
  tick_upper_index: number;
  liquidity: BigNumber;
  fee_growth_inside_0_last_x64: BigNumber;
  fee_growth_inside_1_last_x64: BigNumber;
  token_fees_owed_0: BigNumber;
  token_fees_owed_1: BigNumber;
  reward_growth_inside: BigNumber[];
  padding: BigNumber[];
};

export const protocolPositionStateStruct =
  new BeetStruct<ProtocolPositionState>(
    [
      ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
      ['bump', u8],
      ['pool_id', publicKey],
      ['tick_lower_index', i32],
      ['tick_upper_index', i32],
      ['liquidity', u128],
      ['fee_growth_inside_0_last_x64', u128],
      ['fee_growth_inside_1_last_x64', u128],
      ['token_fees_owed_0', u64],
      ['token_fees_owed_1', u64],
      ['reward_growth_inside', uniformFixedSizeArray(u128, 3)],
      ['padding', uniformFixedSizeArray(u64, 8)],
    ],
    (args) => args as ProtocolPositionState
  );
