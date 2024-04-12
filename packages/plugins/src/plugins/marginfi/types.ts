import { Yield } from '@sonarwatch/portfolio-core';
import { Bank } from './structs/Bank';

export type BankInfo = Bank & {
  dividedAssetShareValue: string;
  dividedLiabilityShareValue: string;
  suppliedYields: Yield[];
  borrowedYields: Yield[];
  suppliedLtv: number;
  borrowedWeight: number;
};
