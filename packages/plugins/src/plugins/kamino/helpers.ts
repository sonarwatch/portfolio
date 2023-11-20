import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import { PublicKey } from '@solana/web3.js';
import { Position, Whirlpool } from '../orca/structs/whirlpool';
import { PersonalPositionState, PoolState } from '../raydium/structs/clmms';
import { WhirlpoolStrategy } from './structs/vaults';
import { ParsedAccount } from '../../utils/solana';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { CurvePoint, Reserve, ReserveLiquidity } from './structs/klend';
import { klendProgramId, lendingMarket, multiplyTokens } from './constants';

const dexes = ['ORCA', 'RAYDIUM', 'CREMA'];

export function dexToNumber(dex: string) {
  for (let i = 0; i < dexes.length; i += 1) {
    if (dexes[i] === dex) {
      return i;
    }
  }
  throw new Error(`Unknown DEX ${dex}`);
}

export function getTokenAmountsFromInfos(
  strategy: ParsedAccount<WhirlpoolStrategy>,
  pool: PoolState | Whirlpool,
  position: PersonalPositionState | Position
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  if (strategy.strategyDex.toNumber() === dexToNumber('ORCA')) {
    const orcaPool = pool as Whirlpool;
    const orcaPosition = position as Position;

    return getTokenAmountsFromLiquidity(
      orcaPosition.liquidity,
      orcaPool.tickCurrentIndex,
      orcaPosition.tickLowerIndex,
      orcaPosition.tickUpperIndex,
      false
    );

    // const whirlpoolSqrtPrice = orcaPool.sqrtPrice;
    // const vaultPositionLiquidity = orcaPosition.liquidity;
    // const vaultPositionTickLowerIndex = orcaPosition.tickLowerIndex;
    // const vaultPositionTickUpperIndex = orcaPosition.tickUpperIndex;
    // const priceLower = orcaTickToPriceX64(vaultPositionTickLowerIndex);
    // const priceUpper = orcaTickToPriceX64(vaultPositionTickUpperIndex);
    // return getOrcaTokenAmountsFromLiquidity(
    //   vaultPositionLiquidity.toNumber(),
    //   whirlpoolSqrtPrice,
    //   priceLower,
    //   priceUpper,
    //   false
    // );
  }
  if (strategy.strategyDex.toNumber() === dexToNumber('RAYDIUM')) {
    const raydiumPool = pool as PoolState;
    const raydiumPosition = position as PersonalPositionState;

    return getTokenAmountsFromLiquidity(
      raydiumPosition.liquidity,
      raydiumPool.tickCurrent,
      raydiumPosition.tickLowerIndex,
      raydiumPosition.tickUpperIndex,
      false
    );
    // const lowerSqrtPriceX64 = new BigNumber(
    //   raydiumTickToPriceX64(raydiumPosition.tickLowerIndex).toString()
    // );
    // const upperSqrtPriceX64 = new BigNumber(
    //   raydiumTickToPriceX64(raydiumPosition.tickUpperIndex).toString()
    // );
    // return getRaydiumTokenAmountsFromLiquidity(
    //   new BigNumber(raydiumPool.sqrtPriceX64),
    //   lowerSqrtPriceX64,
    //   upperSqrtPriceX64,
    //   raydiumPosition.liquidity,
    //   false
    // );
  }
  throw new Error(`Invalid dex ${strategy.strategyDex.toString()}`);
}

const statusByNum = new Map([
  [0, 'IGNORED'],
  [1, 'SHADOW'],
  [2, 'LIVE'],
  [3, 'DEPRECATED'],
  [4, 'STAGING'],
]);

export function getLendingPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from([0]),
      Buffer.from([0]),
      new PublicKey(owner).toBuffer(),
      new PublicKey(lendingMarket).toBuffer(),
      PublicKey.default.toBuffer(),
      PublicKey.default.toBuffer(),
    ],
    klendProgramId
  )[0];
}

export function getMultiplyPdas(owner: string): PublicKey[] {
  return multiplyTokens.map(
    (tokens) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from([1]),
          Buffer.from([0]),
          new PublicKey(owner).toBuffer(),
          new PublicKey(lendingMarket).toBuffer(),
          new PublicKey(tokens[0]).toBuffer(),
          new PublicKey(tokens[1]).toBuffer(),
        ],
        klendProgramId
      )[0]
  );
}

export function isActive(strategy: WhirlpoolStrategy): boolean {
  if (strategy.sharesIssued.isZero()) return false;
  const status = statusByNum.get(strategy.status.toNumber());
  if (!status) return false;
  if (status === 'IGNORED' || status === 'STAGING') return false;
  return true;
}

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
