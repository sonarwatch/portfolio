import BigNumber from 'bignumber.js';
import { SpotBalanceType, SpotMarket, SpotPosition } from './struct';

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);
export const TEN = new BigNumber(10);
export const QUOTE_SPOT_MARKET_INDEX = 0;
export const SPOT_MARKET_UTILIZATION_PRECISION_EXP = new BigNumber(6);
export const SPOT_MARKET_UTILIZATION_PRECISION = new BigNumber(10).pow(
  SPOT_MARKET_UTILIZATION_PRECISION_EXP
);

export const divCeil = (a: BigNumber, b: BigNumber): BigNumber => {
  const quotient = a.div(b);

  const remainder = a.mod(b);

  if (remainder.gt(ZERO)) {
    return quotient.plus(ONE);
  }
  return quotient;
};

export function getTokenAmount(
  scaleBalance: BigNumber,
  spotMarket: SpotMarket,
  balanceType: SpotBalanceType
): BigNumber {
  const precisionDecrease = TEN.pow(new BigNumber(19 - spotMarket.decimals));

  if (balanceType === SpotBalanceType.Deposit) {
    return scaleBalance
      .multipliedBy(spotMarket.cumulativeDepositInterest)
      .div(precisionDecrease.toNumber());
  }
  return divCeil(
    scaleBalance.multipliedBy(spotMarket.cumulativeBorrowInterest),
    precisionDecrease
  );
}

export function getSignedTokenAmount(
  tokenAmount: BigNumber,
  balanceType: SpotBalanceType
): BigNumber {
  if (balanceType === SpotBalanceType.Deposit) {
    return tokenAmount;
  }
  return tokenAmount.abs().negated();
}

export function calculateUtilization(
  bank: SpotMarket,
  delta = ZERO
): BigNumber {
  let tokenDepositAmount = getTokenAmount(
    bank.depositBalance,
    bank,
    SpotBalanceType.Deposit
  );
  let tokenBorrowAmount = getTokenAmount(
    bank.borrowBalance,
    bank,
    SpotBalanceType.Borrow
  );

  if (delta.gt(ZERO)) {
    tokenDepositAmount = tokenDepositAmount.plus(delta);
  } else if (delta.lt(ZERO)) {
    tokenBorrowAmount = tokenBorrowAmount.plus(delta.abs());
  }

  let utilization: BigNumber;
  if (tokenBorrowAmount.eq(ZERO) && tokenDepositAmount.eq(ZERO)) {
    utilization = ZERO;
  } else if (tokenDepositAmount.eq(ZERO)) {
    utilization = SPOT_MARKET_UTILIZATION_PRECISION;
  } else {
    utilization = tokenBorrowAmount
      .multipliedBy(SPOT_MARKET_UTILIZATION_PRECISION)
      .div(tokenDepositAmount);
  }
  return utilization;
}

export function isSpotPositionAvailable(position: SpotPosition): boolean {
  return position.scaledBalance.eq(ZERO) && position.openOrders === 0;
}

export function decodeName(bytes: number[]): string {
  const buffer = Buffer.from(bytes);
  return buffer.toString('utf8').trim();
}
