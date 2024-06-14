import { array, FixableBeetStruct, u8 } from '@metaplex-foundation/beet';
import { blob } from '../../utils/solana';

export type Loan = {
  version: number;
  principalLamports: string;
  orderBook: string;
  valueTokenMint: string;
  escrowBumSeed: number;
  loanState: {
    offer?: LoanOffer;
    taken?: TakenLoan;
  };
};

export type LoanOffer = {
  offer: {
    lenderWallet: string;
    termsSpec: LoanTermsSpec;
    offerTime: number;
  };
};

export type TakenLoan = {
  taken: {
    nftCollateralMint: string;
    lenderNoteMint: string;
    borrowerNoteMint: string;
    apy: APY;
    terms: LoanTerms;
    isCollateralFrozen: number;
  };
};

export type APY = {
  fixed: {
    apy: number;
  };
};

export type LoanTerms = {
  time: {
    start: number;
    duration: string;
    totalOwedLamports: string;
  };
};

export type LoanTermsSpec = {
  time: {
    duration: string;
  };
};

export type OrderBook = {
  orderBookType: {
    nftList: {
      listAccount: string;
    };
  };
};

export type Collection = {
  orderBook: string;
  name: string;
  floor: number;
  tensor_id: string;
};

export type NftList = {
  buffer: Buffer;
  version: number;
  collectionName: number[];
};

export const nftListStruct = new FixableBeetStruct<NftList>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['collectionName', array(u8)],
  ],
  (args) => args as NftList
);
