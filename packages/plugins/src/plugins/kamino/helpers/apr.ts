import Decimal from 'decimal.js';
import { CurvePoint, Reserve, ReserveLiquidity } from '../structs/klend';

function calculateUtilizationRatio(liquidity: ReserveLiquidity) {
  const totalBorrows = getBorrowedAmount(liquidity);
  const totalSupply = getTotalSupply(liquidity);
  if (totalSupply.eq(0)) {
    return 0;
  }
  return totalBorrows.dividedBy(totalSupply).toNumber();
}

function getBorrowedAmount(liquidity: ReserveLiquidity): Decimal {
  return new Decimal(liquidity.borrowedAmountSf.toString());
}

function getTotalSupply(liquidity: ReserveLiquidity): Decimal {
  return getLiquidityAvailableAmount(liquidity)
    .add(getBorrowedAmount(liquidity))
    .sub(getAccumulatedProtocolFees(liquidity))
    .sub(getAccumulatedReferrerFees(liquidity))
    .sub(getPendingReferrerFees(liquidity));
}

function getLiquidityAvailableAmount(liquidity: ReserveLiquidity): Decimal {
  return new Decimal(liquidity.availableAmount.toString());
}

function getAccumulatedProtocolFees(liquidity: ReserveLiquidity): Decimal {
  return new Decimal(liquidity.accumulatedProtocolFeesSf.toString());
}

function getAccumulatedReferrerFees(liquidity: ReserveLiquidity): Decimal {
  return new Decimal(liquidity.accumulatedReferrerFeesSf.toString());
}

function getPendingReferrerFees(liquidity: ReserveLiquidity): Decimal {
  return new Decimal(liquidity.pendingReferrerFeesSf.toString());
}

export function calculateSupplyAPR(reserve: Reserve) {
  const currentUtilization = calculateUtilizationRatio(reserve.liquidity);
  const borrowAPR = calculateBorrowAPR(reserve);
  return (currentUtilization * borrowAPR) / 100;
}

export function calculateBorrowAPR(reserve: Reserve) {
  const currentUtilization = calculateUtilizationRatio(reserve.liquidity);
  const curve = truncateBorrowCurve(reserve.config.borrowRateCurve.points);
  return getBorrowRate(currentUtilization, curve) / 100;
}

const truncateBorrowCurve = (points: CurvePoint[]): [number, number][] => {
  const curve: [number, number][] = [];
  for (const { utilizationRateBps, borrowRateBps } of points) {
    curve.push([utilizationRateBps / 10_000, borrowRateBps / 10_000]);

    if (utilizationRateBps === 10_000) {
      break;
    }
  }
  return curve;
};

export const interpolate = (
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number
) => {
  if (x > x1) {
    // throw 'Cannot do extrapolation';
  }

  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};

export const getBorrowRate = (
  currentUtilization: number,
  curve: [number, number][]
): number => {
  let [x0, y0, x1, y1] = [0, 0, 0, 0];
  let currentUse = currentUtilization;

  if (curve.length < 2) {
    // throw 'Invalid borrow rate curve, only one point';
  }

  if (currentUtilization > 1) {
    currentUse = 1;
  }

  for (let i = 1; i < curve.length; i++) {
    const [pointUtilization, pointRate] = curve[i];
    if (pointUtilization === currentUse) {
      return pointRate;
    }

    if (currentUse <= pointUtilization) {
      [x0, y0] = curve[i - 1];
      [x1, y1] = curve[i];
      break;
    }
  }

  if (x0 === 0 && y0 === 0 && x1 === 0 && y1 === 0) {
    // throw 'Invalid borrow rate curve, could not identify the interpolation points.';
  }

  if (x0 >= x1 || y0 > y1) {
    // throw 'Invalid borrow rate curve, curve is not uniformly increasing';
  }

  return interpolate(currentUse, x0, x1, y0, y1);
};
