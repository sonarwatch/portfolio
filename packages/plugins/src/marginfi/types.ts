import BigNumber from 'bignumber.js';
import { Bank } from './structs/Bank';

export type BankInfo = Bank & {
  dividedAssetShareValue: BigNumber;
  dividedLiabilityShareValue: BigNumber;
};
