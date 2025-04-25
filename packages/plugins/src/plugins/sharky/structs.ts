import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  u8,
  u16,
  u32,
  FixableBeetStruct,
  uniformFixedSizeArray,
  DataEnumKeyAsKind,
  dataEnum,
  FixableBeetArgsStruct,
  FixableBeet,
  array,
  BeetStruct,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u64 } from '../../utils/solana';

type APYRecord = {
  Fixed: {
    apy: number;
  };
};
type APY = DataEnumKeyAsKind<APYRecord>;

const apyStruct = dataEnum<APYRecord>([
  [
    'Fixed',
    new FixableBeetArgsStruct<APYRecord['Fixed']>(
      [['apy', u32]],
      'APYRecord["Fixed"]'
    ),
  ],
]) as FixableBeet<APY>;

type LoanTermsRecord = {
  Time: {
    start: BigNumber;
    duration: BigNumber;
    total_owed_lamports: BigNumber;
  };
};
type LoanTerms = DataEnumKeyAsKind<LoanTermsRecord>;

const loanTermsStruct = dataEnum<LoanTermsRecord>([
  [
    'Time',
    new FixableBeetArgsStruct<LoanTermsRecord['Time']>(
      [
        ['start', i64],
        ['duration', u64],
        ['total_owed_lamports', u64],
      ],
      'LoanTermsRecord["Time"]'
    ),
  ],
]) as FixableBeet<LoanTerms>;

type OrderBookTypeRecord = {
  Collection: {
    collectionKey: PublicKey;
  };
  NFTList: {
    collectionKey: PublicKey;
  };
};
type OrderBookType = DataEnumKeyAsKind<OrderBookTypeRecord>;

const orderBookTypeStruct = dataEnum<OrderBookTypeRecord>([
  [
    'Collection',
    new FixableBeetArgsStruct<OrderBookTypeRecord['Collection']>(
      [['collectionKey', publicKey]],
      'OrderBookTypeRecord["Collection"]'
    ),
  ],
  [
    'NFTList',
    new FixableBeetArgsStruct<OrderBookTypeRecord['NFTList']>(
      [['collectionKey', publicKey]],
      'OrderBookTypeRecord["NFTList"]'
    ),
  ],
]) as FixableBeet<OrderBookType>;

type LoanTermsSpecRecord = {
  Time: {
    duration: BigNumber;
  };
};
type LoanTermsSpec = DataEnumKeyAsKind<LoanTermsSpecRecord>;

const loanTermsSpecStruct = dataEnum<LoanTermsSpecRecord>([
  [
    'Time',
    new FixableBeetArgsStruct<LoanTermsSpecRecord['Time']>(
      [['duration', u64]],
      'LoanTermsSpecRecord["Time"]'
    ),
  ],
]) as FixableBeet<LoanTermsSpec>;

type BookLoanTermsRecord = {
  Fixed: {
    terms: LoanTermsSpec;
  };
  LenderChooses: NonNullable<unknown>;
};
type BookLoanTerms = DataEnumKeyAsKind<BookLoanTermsRecord>;

const bookLoanTermsStruct = dataEnum<BookLoanTermsRecord>([
  [
    'Fixed',
    new FixableBeetArgsStruct<BookLoanTermsRecord['Fixed']>(
      [['terms', loanTermsSpecStruct]],
      'BookLoanTermsRecord["Fixed"]'
    ),
  ],
  [
    'LenderChooses',
    new FixableBeetArgsStruct<BookLoanTermsRecord['LenderChooses']>(
      [],
      'BookLoanTermsRecord["LenderChooses"]'
    ),
  ],
]) as FixableBeet<BookLoanTerms>;

export type OrderBook = {
  accountDiscriminator: number[];
  version: number;
  orderBookType: OrderBookType;
  apy: APY;
  loanTerms: BookLoanTerms;
  feePermillicentage: number;
  feeAuthority: PublicKey;
};

export const orderBookStruct = new FixableBeetStruct<OrderBook>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['orderBookType', orderBookTypeStruct],
    ['apy', apyStruct],
    ['loanTerms', bookLoanTermsStruct],
    ['feePermillicentage', u16],
    ['feeAuthority', publicKey],
  ],
  (args) => args as OrderBook
);

export type NftList = {
  accountDiscriminator: number[];
  version: number;
  collectionName: number[];
};

export const nftListStruct = new FixableBeetStruct<NftList>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['collectionName', array(u8)],
  ],
  (args) => args as NftList
);

type LoanStateRecord = {
  Offer: {
    lenderWallet: PublicKey;
    termsSpec: LoanTermsSpec;
    offerTime: BigNumber;
  };
  Taken: {
    nftCollateralMint: PublicKey;
    lenderNoteMint: PublicKey;
    borrowerNoteMint: PublicKey;
    apy: APY;
    terms: LoanTerms;
    isCollateralFrozen: number;
  };
};
type LoanState = DataEnumKeyAsKind<LoanStateRecord>;

const loanStateStruct = dataEnum<LoanStateRecord>([
  [
    'Offer',
    new FixableBeetArgsStruct<LoanStateRecord['Offer']>(
      [
        ['lenderWallet', publicKey],
        ['termsSpec', loanTermsSpecStruct],
        ['offerTime', i64],
      ],
      'OrderBookTypeRecord["Offer"]'
    ),
  ],
  [
    'Taken',
    new FixableBeetArgsStruct<LoanStateRecord['Taken']>(
      [
        ['nftCollateralMint', publicKey],
        ['lenderNoteMint', publicKey],
        ['borrowerNoteMint', publicKey],
        ['apy', apyStruct],
        ['terms', loanTermsStruct],
        ['isCollateralFrozen', u8],
      ],
      'OrderBookTypeRecord["Taken"]'
    ),
  ],
]) as FixableBeet<LoanState>;

export type Loan = {
  accountDiscriminator: number[];
  version: number;
  principalLamports: BigNumber;
  orderBook: PublicKey;
  valueTokenMint: PublicKey;
  escrowBumpSeed: number;
  loanState: LoanState;
};

export const loanStruct = new FixableBeetStruct<Loan>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['principalLamports', u64],
    ['orderBook', publicKey],
    ['valueTokenMint', publicKey],
    ['escrowBumpSeed', u8],
    ['loanState', loanStateStruct],
  ],
  (args) => args as Loan
);

// Structure EscrowPda
export type EscrowPda = {
  accountDiscriminator: number[];
  bump: number;
};

export const escrowPdaStruct = new FixableBeetStruct<EscrowPda>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
  ],
  (args) => args as EscrowPda
);

// Structure ProgramVersion
export type ProgramVersion = {
  accountDiscriminator: number[];
  version: number;
  bump: number;
  updated: BigNumber;
};

export const programVersionStruct = new FixableBeetStruct<ProgramVersion>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['bump', u8],
    ['updated', i64],
  ],
  (args) => args as ProgramVersion
);

export type TokenLendingPool = {
  accountDiscriminator: number[];
  orderbook: PublicKey;
  lender: PublicKey;
  usdc_vault: PublicKey;
  collateral_vault: PublicKey;
  nonce: BigNumber;
  total_usdc_liquidity: BigNumber;
  available_usdc_liquidity: BigNumber;
  collateral_required_amount: BigNumber;
  total_usdc_interest: BigNumber;
  total_loan_count: BigNumber;
  active_loan_count: BigNumber;
  total_defaulted_loan_count: BigNumber;
  total_defaulted_usdc_amount: BigNumber;
  total_defaulted_collateral_amount: BigNumber;
  version: number;
  bump: number;
  padding: number[];
};

export const tokenLendingPoolStruct = new BeetStruct<TokenLendingPool>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['orderbook', publicKey],
    ['lender', publicKey],
    ['usdc_vault', publicKey],
    ['collateral_vault', publicKey],
    ['nonce', u64],
    ['total_usdc_liquidity', u64],
    ['available_usdc_liquidity', u64],
    ['collateral_required_amount', u64],
    ['total_usdc_interest', u64],
    ['total_loan_count', u64],
    ['active_loan_count', u64],
    ['total_defaulted_loan_count', u64],
    ['total_defaulted_usdc_amount', u64],
    ['total_defaulted_collateral_amount', u64],
    ['version', u8],
    ['bump', u8],
    ['padding', uniformFixedSizeArray(u8, 6)],
  ],
  (args) => args as TokenLendingPool
);

export type TokenLendingOrderBook = {
  accountDiscriminator: number[];
  fee_authority: PublicKey;
  loan_mint: PublicKey;
  collateral_mint: PublicKey;
  collateral_token_program: PublicKey;
  duration: BigNumber;
  min_liquidity: BigNumber;
  max_liquidity: BigNumber;
  apr: number;
  fee_permillicentage: number;
  collateral_decimals: number;
  version: number;
  bump: number;
  padding: number[];
};

export const tokenLendingOrderBookStruct =
  new BeetStruct<TokenLendingOrderBook>(
    [
      ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
      ['fee_authority', publicKey],
      ['loan_mint', publicKey],
      ['collateral_mint', publicKey],
      ['collateral_token_program', publicKey],
      ['duration', u64],
      ['min_liquidity', u64],
      ['max_liquidity', u64],
      ['apr', u32],
      ['fee_permillicentage', u16],
      ['collateral_decimals', u8],
      ['version', u8],
      ['bump', u8],
      ['padding', uniformFixedSizeArray(u8, 7)],
    ],
    (args) => args as TokenLendingOrderBook
  );

export type TokenLendingLoan = {
  accountDiscriminator: number[];
  orderbook: PublicKey;
  borrower: PublicKey;
  pool: PublicKey;
  principal_usdc_amount: BigNumber;
  collateral_required_amount: BigNumber;
  start_ts: BigNumber;
  end_ts: BigNumber;
  apr: number;
  version: number;
  padding: number[];
};

export const tokenLendingLoanStruct = new BeetStruct<TokenLendingLoan>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['orderbook', publicKey],
    ['borrower', publicKey],
    ['pool', publicKey],
    ['principal_usdc_amount', u64],
    ['collateral_required_amount', u64],
    ['start_ts', u64],
    ['end_ts', u64],
    ['apr', u32],
    ['version', u8],
    ['padding', uniformFixedSizeArray(u8, 3)],
  ],
  (args) => args as TokenLendingLoan
);
