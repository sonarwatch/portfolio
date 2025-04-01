import BigNumber from 'bignumber.js';

export type FormattedLendingPool = {
  APR: number;
  borrowAPR: number;
  depositNoteNum: BigNumber;
  depositedTokenNum: BigNumber;
  depositNoteRate: number;
  borrowNoteNum: BigNumber;
  borrowedTokenNum: BigNumber;
  borrowNoteRate: number;
  depositInterest: number;
  borrowInterest: number;
};
