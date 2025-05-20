import BigNumber from 'bignumber.js';
import { MarginPool } from './structs';

export type CalcMarginPool = MarginPool & {
  depositNoteExchangeRate: BigNumber;
  loanNoteExchangeRate: BigNumber;
};
