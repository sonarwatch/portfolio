import { Bank } from './struct';

export type BankEnhanced = Bank & {
  depositApr?: number;
  borrowApr?: number;
};

export type BankDetails = {
  mint: string;
  tokenIndex: number;
  depositIndex: string;
  borrowIndex: string;
};
