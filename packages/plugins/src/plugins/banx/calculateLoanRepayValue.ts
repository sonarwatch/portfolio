import BigNumber from 'bignumber.js';
import { ParsedAccount } from '../../utils/solana';
import { BondTradeTransactionV3 } from './types';

const BONDS = {
  PROGRAM_PUBKEY: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
  ADMIN_PUBKEY: 'revJ8QJgQ3xCcZ6CMykjsmGMYdg8Pj9WnqgJZBHBwSK',
  PROTOCOL_FEE_PERCENT: 100, // ? Base points
  PROTOCOL_REPAY_FEE: 620, // ? Base points
};

const SOL_WAD = 1e9;
const SECONDS_IN_YEAR = 31536000;
const BASE_POINTS = 10000;

const wadMul = (x: number, y: number) => Math.floor((x * y) / SOL_WAD);

const wadDiv = (x: number, y: number) => Math.floor((x * SOL_WAD) / y);

const basePointsToWads = (basePoints: number) =>
  Math.floor((basePoints * SOL_WAD) / BASE_POINTS);

const calculateCurrentInterestSolPure = ({
  loanValue,
  startTime,
  currentTime,
  rateBasePoints,
}: {
  loanValue: number;
  startTime: number;
  currentTime: number;
  rateBasePoints: number;
}) => {
  const loanTime = currentTime - startTime;
  const secondsInYearWad = SECONDS_IN_YEAR * SOL_WAD;

  const yearsWad = wadDiv(loanTime * SOL_WAD, secondsInYearWad);
  return wadMul(loanValue, wadMul(yearsWad, basePointsToWads(rateBasePoints)));
};

export const calculateLoanRepayValue = (
  acc: ParsedAccount<BondTradeTransactionV3>
): BigNumber => {
  const loanValue = Number(acc.borrowerOriginalLent);

  const calculatedInterest = calculateCurrentInterestSolPure({
    loanValue,
    startTime: Number(acc.soldAt),
    currentTime: Date.now() / 1000,
    rateBasePoints: Number(acc.amountOfBonds) + BONDS.PROTOCOL_REPAY_FEE,
  });

  return new BigNumber(loanValue).plus(calculatedInterest);
};
