import {
  BeetStruct,
  bool,
  COption,
  coption,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { u64, i64 } from '../../utils/solana';

export type LoanTerms = {
  apyBps: BigNumber;
  duration: BigNumber;
  principal: BigNumber;
};

export const loanTermsStruct = new BeetStruct<LoanTerms>(
  [
    ['apyBps', u64],
    ['duration', u64],
    ['principal', u64],
  ],
  (args) => args as LoanTerms
);

export type LtvTerms = {
  ltvBps: BigNumber;
  maxOffer: BigNumber;
};

export const ltvTermsStruct = new BeetStruct<LtvTerms>(
  [
    ['ltvBps', u64],
    ['maxOffer', u64],
  ],
  (args) => args as LtvTerms
);

export type ListedLoan = {
  listed: boolean;
  price: BigNumber;
  sold: boolean;
  fox: boolean;
  listingTime: BigNumber;
};

export const listedLoanStruct = new BeetStruct<ListedLoan>(
  [
    ['listed', bool],
    ['price', u64],
    ['sold', bool],
    ['fox', bool],
    ['listingTime', i64],
  ],
  (args) => args as ListedLoan
);

export enum LoanStatus {
  WaitingForBorrower = 0,
  WaitingForLender = 1,
  Active = 2,
  Repaid = 3,
  Defaulted = 4,
  OnSale = 5,
}

export enum OfferType {
  Global = 0,
  Mortgage = 1,
  Borrow = 2,
}

export type Loan = {
  accountDiscriminator: number[];
  bump: number;
  lender: PublicKey;
  borrower: PublicKey;
  mint: PublicKey;
  collectionConfig: PublicKey;
  status: LoanStatus;
  loanTerms: LoanTerms;
  creationTime: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  fox: boolean;
  mortgage: boolean;
  private: boolean;
  offerType: OfferType;
  listingPrice: BigNumber;
  ltvTerms: COption<LtvTerms>;
  pool: boolean;
  listedLoan: ListedLoan | null;
};

export const loanStruct = new FixableBeetStruct<Loan>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['lender', publicKey],
    ['borrower', publicKey],
    ['mint', publicKey],
    ['collectionConfig', publicKey],
    ['status', u8],
    ['loanTerms', loanTermsStruct],
    ['creationTime', i64],
    ['startTime', i64],
    ['endTime', i64],
    ['fox', bool],
    ['mortgage', bool],
    ['private', bool],
    ['offerType', u8],
    ['listingPrice', u64],
    ['ltvTerms', coption(ltvTermsStruct)],
    ['pool', bool],
    ['listedLoan', coption(listedLoanStruct)],
  ],
  (args) => args as Loan
);
