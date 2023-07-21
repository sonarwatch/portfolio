import { Bank } from './struct';

export type BankEnhanced = Bank & {
  depositApr?: number;
  borrowApr?: number;
};
