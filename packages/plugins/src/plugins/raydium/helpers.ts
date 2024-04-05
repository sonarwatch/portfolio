/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { PortfolioAssetCollectible } from '@sonarwatch/portfolio-core';
import { positionsIdentifier } from './constants';

export function isARaydiumPosition(nft: PortfolioAssetCollectible): boolean {
  return nft.data.name === positionsIdentifier;
}

const ZERO = new BN(0);
const ONE = new BN(1);
const Q64 = new BN(1).shln(64);
const Q128 = new BN(1).shln(128);
const U64Resolution = 64;
const MaxUint128 = Q128.subn(1);
const MIN_TICK = -307200;
const MAX_TICK = -MIN_TICK;

function signedRightShift(n0: BN, shiftBy: number, bitWidth: number) {
  const twoN0 = n0.toTwos(bitWidth).shrn(shiftBy);
  twoN0.imaskn(bitWidth - shiftBy + 1);
  return twoN0.fromTwos(bitWidth - shiftBy);
}

function mulRightShift(val: BN, mulBy: BN) {
  return signedRightShift(val.mul(mulBy), 64, 256);
}

export function raydiumTickToPriceX64(tick: number) {
  if (!Number.isInteger(tick)) {
    throw new Error('tick must be integer');
  }
  if (tick < MIN_TICK || tick > MAX_TICK) {
    throw new Error('tick must be in MIN_TICK and MAX_TICK');
  }
  const tickAbs = tick < 0 ? tick * -1 : tick;

  let ratio =
    (tickAbs & 0x1) != 0
      ? new BN('18445821805675395072')
      : new BN('18446744073709551616');
  if ((tickAbs & 0x2) != 0) {
    ratio = mulRightShift(ratio, new BN('18444899583751176192'));
  }
  if ((tickAbs & 0x4) != 0) {
    ratio = mulRightShift(ratio, new BN('18443055278223355904'));
  }
  if ((tickAbs & 0x8) != 0) {
    ratio = mulRightShift(ratio, new BN('18439367220385607680'));
  }
  if ((tickAbs & 0x10) != 0) {
    ratio = mulRightShift(ratio, new BN('18431993317065453568'));
  }
  if ((tickAbs & 0x20) != 0) {
    ratio = mulRightShift(ratio, new BN('18417254355718170624'));
  }
  if ((tickAbs & 0x40) != 0) {
    ratio = mulRightShift(ratio, new BN('18387811781193609216'));
  }
  if ((tickAbs & 0x80) != 0) {
    ratio = mulRightShift(ratio, new BN('18329067761203558400'));
  }
  if ((tickAbs & 0x100) != 0) {
    ratio = mulRightShift(ratio, new BN('18212142134806163456'));
  }
  if ((tickAbs & 0x200) != 0) {
    ratio = mulRightShift(ratio, new BN('17980523815641700352'));
  }
  if ((tickAbs & 0x400) != 0) {
    ratio = mulRightShift(ratio, new BN('17526086738831433728'));
  }
  if ((tickAbs & 0x800) != 0) {
    ratio = mulRightShift(ratio, new BN('16651378430235570176'));
  }
  if ((tickAbs & 0x1000) != 0) {
    ratio = mulRightShift(ratio, new BN('15030750278694412288'));
  }
  if ((tickAbs & 0x2000) != 0) {
    ratio = mulRightShift(ratio, new BN('12247334978884435968'));
  }
  if ((tickAbs & 0x4000) != 0) {
    ratio = mulRightShift(ratio, new BN('8131365268886854656'));
  }
  if ((tickAbs & 0x8000) != 0) {
    ratio = mulRightShift(ratio, new BN('3584323654725218816'));
  }
  if ((tickAbs & 0x10000) != 0) {
    ratio = mulRightShift(ratio, new BN('696457651848324352'));
  }
  if ((tickAbs & 0x20000) != 0) {
    ratio = mulRightShift(ratio, new BN('26294789957507116'));
  }
  if ((tickAbs & 0x40000) != 0) {
    ratio = mulRightShift(ratio, new BN('37481735321082'));
  }

  if (tick > 0) ratio = MaxUint128.div(ratio);
  return ratio;
}

function mulDivRoundingUp(a: BN, b: BN, denominator: BN) {
  const numerator = a.mul(b);
  let result = numerator.div(denominator);
  if (!numerator.mod(denominator).eq(ZERO)) {
    result = result.add(ONE);
  }
  return result;
}

function mulDivFloor(a: BN, b: BN, denominator: BN) {
  if (denominator.eq(ZERO)) {
    throw new Error('division by 0');
  }
  return a.mul(b).div(denominator);
}

function mulDivCeil(a: BN, b: BN, denominator: BN) {
  if (denominator.eq(ZERO)) {
    throw new Error('division by 0');
  }
  const numerator = a.mul(b).add(denominator.sub(ONE));
  return numerator.div(denominator);
}

function getTokenAmountAFromLiquidity(
  sqrtPriceX64A: BN,
  sqrtPriceX64B: BN,
  liquidity: BN,
  roundUp: boolean
) {
  if (sqrtPriceX64A.gt(sqrtPriceX64B)) {
    [sqrtPriceX64A, sqrtPriceX64B] = [sqrtPriceX64B, sqrtPriceX64A];
  }

  if (!sqrtPriceX64A.gt(ZERO)) {
    throw new Error('sqrtPriceX64A must greater than 0');
  }

  const numerator1 = liquidity.ushln(U64Resolution);
  const numerator2 = sqrtPriceX64B.sub(sqrtPriceX64A);

  return roundUp
    ? mulDivRoundingUp(
        mulDivCeil(numerator1, numerator2, sqrtPriceX64B),
        ONE,
        sqrtPriceX64A
      )
    : mulDivFloor(numerator1, numerator2, sqrtPriceX64B).div(sqrtPriceX64A);
}

function getTokenAmountBFromLiquidity(
  sqrtPriceX64A: BN,
  sqrtPriceX64B: BN,
  liquidity: BN,
  roundUp: boolean
) {
  if (sqrtPriceX64A.gt(sqrtPriceX64B)) {
    [sqrtPriceX64A, sqrtPriceX64B] = [sqrtPriceX64B, sqrtPriceX64A];
  }
  if (!sqrtPriceX64A.gt(ZERO)) {
    throw new Error('sqrtPriceX64A must greater than 0');
  }

  return roundUp
    ? mulDivCeil(liquidity, sqrtPriceX64B.sub(sqrtPriceX64A), Q64)
    : mulDivFloor(liquidity, sqrtPriceX64B.sub(sqrtPriceX64A), Q64);
}

export function getRaydiumTokenAmountsFromLiquidity(
  sqrtPriceCurrentX64: BigNumber,
  sqrtPriceX64A: BigNumber,
  sqrtPriceX64B: BigNumber,
  liquidity: BigNumber,
  roundUp: boolean
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  if (sqrtPriceX64A.gt(sqrtPriceX64B)) {
    [sqrtPriceX64A, sqrtPriceX64B] = [sqrtPriceX64B, sqrtPriceX64A];
  }

  if (sqrtPriceCurrentX64.lte(sqrtPriceX64A)) {
    return {
      tokenAmountA: new BigNumber(
        getTokenAmountAFromLiquidity(
          new BN(sqrtPriceX64A.toString()),
          new BN(sqrtPriceX64B.toString()),
          new BN(liquidity.toString()),
          roundUp
        ).toString()
      ),
      tokenAmountB: new BigNumber(0),
    };
  }
  if (sqrtPriceCurrentX64.lt(sqrtPriceX64B)) {
    const amountA = new BigNumber(
      getTokenAmountAFromLiquidity(
        new BN(sqrtPriceCurrentX64.toString()),
        new BN(sqrtPriceX64B.toString()),
        new BN(liquidity.toString()),
        roundUp
      ).toString()
    );
    const amountB = new BigNumber(
      getTokenAmountBFromLiquidity(
        new BN(sqrtPriceX64A.toString()),
        new BN(sqrtPriceCurrentX64.toString()),
        new BN(liquidity.toString()),
        roundUp
      ).toString()
    );
    return { tokenAmountA: amountA, tokenAmountB: amountB };
  }
  return {
    tokenAmountA: new BigNumber(0),
    tokenAmountB: new BigNumber(
      getTokenAmountBFromLiquidity(
        new BN(sqrtPriceX64A.toString()),
        new BN(sqrtPriceX64B.toString()),
        new BN(liquidity.toString()),
        roundUp
      ).toString()
    ),
  };
}
