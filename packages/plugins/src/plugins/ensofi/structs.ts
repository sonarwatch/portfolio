import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  u8,
  FixableBeetStruct,
  uniformFixedSizeArray,
  COption,
  coption,
  u16,
  array,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { f64, i64, u64 } from '../../utils/solana';

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
  offerId: number[];
  lender: PublicKey;
  lendMintToken: PublicKey;
  amount: BigNumber;
  bump: number;
  status: LendOfferStatus;
};

export const lendOfferAccountStruct = new FixableBeetStruct<LendOfferAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['interest', u16],
    ['lenderFeePercent', f64],
    ['duration', u64],
    ['offerId', array(u8)],
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
