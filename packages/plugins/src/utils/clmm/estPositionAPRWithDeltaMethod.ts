import BN from 'bn.js';
import Decimal from 'decimal.js';
import { tickIndexToSqrtPriceX64 } from './tokenAmountFromLiquidity';
import { toBN } from '../misc/toBN';

const Q_64 = '18446744073709551616';

export type EstPosAPRResult = {
  feeAPR: Decimal;
};

function toX64Decimal(num: Decimal): Decimal {
  return num.mul(Decimal.pow(2, 64));
}

function fromX64(num: BN): Decimal {
  return new Decimal(num.toString()).mul(Decimal.pow(2, -64));
}

export function estPositionAPRWithDeltaMethod(
  currentTickIndex: number,
  lowerTickIndex: number,
  upperTickIndex: number,
  currentSqrtPriceX64: BN,
  poolLiquidity: BN,
  decimalsA: number,
  decimalsB: number,
  feeRate: number,
  amountAStr: string,
  amountBStr: string,
  swapVolumeStr: string,
  coinAPriceStr: string,
  coinBPriceStr: string
): EstPosAPRResult {
  const amountA = new Decimal(amountAStr);
  const amountB = new Decimal(amountBStr);
  const swapVolume = new Decimal(swapVolumeStr);
  const coinAPrice = new Decimal(coinAPriceStr);
  const coinBPrice = new Decimal(coinBPriceStr);

  const lowerSqrtPriceX64 = toBN(tickIndexToSqrtPriceX64(lowerTickIndex));
  const upperSqrtPriceX64 = toBN(tickIndexToSqrtPriceX64(upperTickIndex));
  const lowerSqrtPriceD = toX64Decimal(fromX64(lowerSqrtPriceX64)).round();
  const upperSqrtPriceD = toX64Decimal(fromX64(upperSqrtPriceX64)).round();
  const currentSqrtPriceD = toX64Decimal(fromX64(currentSqrtPriceX64)).round();
  let deltaLiquidity;
  const liquidityAmount0 = amountA
    .mul(new Decimal(10 ** decimalsA))
    .mul(upperSqrtPriceD.mul(lowerSqrtPriceD))
    .div(Q_64)
    .div(upperSqrtPriceD.sub(lowerSqrtPriceD))
    .round();
  const liquidityAmount1 = amountB
    .mul(new Decimal(10 ** decimalsB))
    .mul(Q_64)
    .div(upperSqrtPriceD.sub(lowerSqrtPriceD))
    .round();
  if (currentTickIndex < lowerTickIndex) {
    deltaLiquidity = liquidityAmount0;
  } else if (currentTickIndex > upperTickIndex) {
    deltaLiquidity = liquidityAmount1;
  } else {
    deltaLiquidity = Decimal.min(liquidityAmount0, liquidityAmount1);
  }
  const deltaY = deltaLiquidity
    .mul(currentSqrtPriceD.sub(lowerSqrtPriceD))
    .div(Q_64);
  const deltaX = deltaLiquidity
    .mul(upperSqrtPriceD.sub(currentSqrtPriceD))
    .div(currentSqrtPriceD.mul(upperSqrtPriceD))
    .mul(Q_64);
  const posValidTVL = deltaX
    .div(new Decimal(10 ** decimalsA))
    .mul(coinAPrice)
    .add(deltaY.div(new Decimal(10 ** decimalsB).mul(coinBPrice)));

  const feeAPR = deltaLiquidity.eq(new Decimal(0))
    ? new Decimal(0)
    : new Decimal(feeRate)
        .mul(swapVolume)
        .mul(
          new Decimal(deltaLiquidity.toString()).div(
            new Decimal(poolLiquidity.toString()).add(
              new Decimal(deltaLiquidity.toString())
            )
          )
        )
        .div(posValidTVL)
        .mul(365);

  return {
    feeAPR,
  };
}
