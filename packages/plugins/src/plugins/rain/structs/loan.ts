import {
  BeetStruct,
  bool,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../../utils/solana';

export enum LoanKind {
  Loan,
  Mortgage,
}

export enum LoanStatus {
  Ongoing,
  Repaid,
  Liquidated,
  Sold,
}

export enum Marketplace {
  None,
  Auctionhouse,
  Solanart,
  Hyperspace,
  Yaww,
  Hadeswap,
  Rain,
  TensorswapOrder,
  TensorswapListing,
  MagicEden,
}
export type Sale = {
  isForSale: boolean;
  salePrice: BigNumber;
  currency: PublicKey;
};
export const saleStruct = new BeetStruct<Sale>(
  [
    ['isForSale', bool],
    ['salePrice', u64],
    ['currency', publicKey],
  ],
  (args) => args as Sale
);

export type Listing = {
  isListed: boolean;
  price: BigNumber;
};
export const listingStruct = new BeetStruct<Listing>(
  [
    ['isListed', bool],
    ['price', u64],
  ],
  (args) => args as Listing
);

export type Loan = {
  buffer: Buffer;
  kind: LoanKind;
  status: LoanStatus;
  borrower: PublicKey;
  lender: PublicKey;
  pool: PublicKey;
  mint: PublicKey;
  currency: PublicKey;
  isCustom: boolean;
  isFrozen: boolean;
  price: BigNumber;
  interest: BigNumber;
  amount: BigNumber;
  duration: BigNumber;
  collection: BigNumber;
  liquidation: number;
  marketplace: Marketplace;
  sale: Sale;
  createdAt: BigNumber;
  expiredAt: BigNumber;
  repaidAt: BigNumber;
  soldAt: BigNumber;
  liquidatedAt: BigNumber;
  listing: Listing;
  isCompressedLoan: boolean;
  isDefi: boolean;
  padding: BigNumber[];
  padding1: BigNumber;
  padding2: number;
};

export const loanStruct = new BeetStruct<Loan>(
  [
    ['buffer', blob(8)],
    ['kind', u8],
    ['status', u8],
    ['borrower', publicKey],
    ['lender', publicKey],
    ['pool', publicKey],
    ['mint', publicKey],
    ['currency', publicKey],
    ['isCustom', bool],
    ['isFrozen', bool],
    ['price', u64],
    ['interest', u64],
    ['amount', u64],
    ['duration', u64],
    ['collection', u32],
    ['liquidation', u16],
    ['marketplace', u8],
    ['sale', saleStruct],
    ['createdAt', u64],
    ['expiredAt', u64],
    ['repaidAt', u64],
    ['soldAt', u64],
    ['liquidatedAt', u64],
    ['listing', listingStruct],
    ['isCompressedLoan', bool],
    ['isDefi', bool],
    ['padding', uniformFixedSizeArray(u64, 6)],
    ['padding1', u32],
    ['padding2', u8],
  ],
  (args) => args as Loan
);
