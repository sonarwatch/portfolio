/* eslint-disable no-bitwise */
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const ZERO = new BN(0);
export const ONE = new BN(1);
export const TWO = new BN(2);
export const THREE = new BN(3);
export const FIVE = new BN(5);
export const TEN = new BN(10);
export const HUNDRED = new BN(100);
export const THOUSAND = new BN(1000);
export const TENTHOUSAND = new BN(10000);
export const U64Resolution = 64;
export const Q64 = new BN(1).shln(64);
export const Q128 = new BN(1).shln(128);

export function signedShiftRight(n0: BN, shiftBy: number, bitWidth: number) {
  const twoN0 = n0.toTwos(bitWidth).shrn(shiftBy);
  twoN0.imaskn(bitWidth - shiftBy + 1);
  return twoN0.fromTwos(bitWidth - shiftBy);
}

export function tickIndexToSqrtPricePositive(tick: number): BigNumber {
  let ratio;

  if ((tick & 1) !== 0) {
    ratio = new BN('79232123823359799118286999567');
  } else {
    ratio = new BN('79228162514264337593543950336');
  }

  if ((tick & 2) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('79236085330515764027303304731')),
      96,
      256
    );
  }
  if ((tick & 4) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('79244008939048815603706035061')),
      96,
      256
    );
  }
  if ((tick & 8) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('79259858533276714757314932305')),
      96,
      256
    );
  }
  if ((tick & 16) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('79291567232598584799939703904')),
      96,
      256
    );
  }
  if ((tick & 32) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('79355022692464371645785046466')),
      96,
      256
    );
  }
  if ((tick & 64) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('79482085999252804386437311141')),
      96,
      256
    );
  }
  if ((tick & 128) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('79736823300114093921829183326')),
      96,
      256
    );
  }
  if ((tick & 256) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('80248749790819932309965073892')),
      96,
      256
    );
  }
  if ((tick & 512) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('81282483887344747381513967011')),
      96,
      256
    );
  }
  if ((tick & 1024) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('83390072131320151908154831281')),
      96,
      256
    );
  }
  if ((tick & 2048) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('87770609709833776024991924138')),
      96,
      256
    );
  }
  if ((tick & 4096) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('97234110755111693312479820773')),
      96,
      256
    );
  }
  if ((tick & 8192) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('119332217159966728226237229890')),
      96,
      256
    );
  }
  if ((tick & 16384) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('179736315981702064433883588727')),
      96,
      256
    );
  }
  if ((tick & 32768) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('407748233172238350107850275304')),
      96,
      256
    );
  }
  if ((tick & 65536) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('2098478828474011932436660412517')),
      96,
      256
    );
  }
  if ((tick & 131072) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('55581415166113811149459800483533')),
      96,
      256
    );
  }
  if ((tick & 262144) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('38992368544603139932233054999993551')),
      96,
      256
    );
  }

  return new BigNumber(signedShiftRight(ratio, 32, 256).toString());
}

export function tickIndexToSqrtPriceNegative(tickIndex: number) {
  const tick = Math.abs(tickIndex);
  let ratio;

  if ((tick & 1) !== 0) {
    ratio = new BN('18445821805675392311');
  } else {
    ratio = new BN('18446744073709551616');
  }

  if ((tick & 2) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('18444899583751176498')),
      64,
      256
    );
  }
  if ((tick & 4) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('18443055278223354162')),
      64,
      256
    );
  }
  if ((tick & 8) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('18439367220385604838')),
      64,
      256
    );
  }
  if ((tick & 16) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('18431993317065449817')),
      64,
      256
    );
  }
  if ((tick & 32) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('18417254355718160513')),
      64,
      256
    );
  }
  if ((tick & 64) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('18387811781193591352')),
      64,
      256
    );
  }
  if ((tick & 128) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('18329067761203520168')),
      64,
      256
    );
  }
  if ((tick & 256) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('18212142134806087854')),
      64,
      256
    );
  }
  if ((tick & 512) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('17980523815641551639')),
      64,
      256
    );
  }
  if ((tick & 1024) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('17526086738831147013')),
      64,
      256
    );
  }
  if ((tick & 2048) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('16651378430235024244')),
      64,
      256
    );
  }
  if ((tick & 4096) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('15030750278693429944')),
      64,
      256
    );
  }
  if ((tick & 8192) !== 0) {
    ratio = signedShiftRight(
      ratio.mul(new BN('12247334978882834399')),
      64,
      256
    );
  }
  if ((tick & 16384) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('8131365268884726200')), 64, 256);
  }
  if ((tick & 32768) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('3584323654723342297')), 64, 256);
  }
  if ((tick & 65536) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('696457651847595233')), 64, 256);
  }
  if ((tick & 131072) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('26294789957452057')), 64, 256);
  }
  if ((tick & 262144) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('37481735321082')), 64, 256);
  }

  return new BigNumber(ratio.toString());
}

export function tickIndexToSqrtPriceX64(tickIndex: number) {
  if (tickIndex > 0) {
    return new BigNumber(tickIndexToSqrtPricePositive(tickIndex));
  }
  return new BigNumber(tickIndexToSqrtPriceNegative(tickIndex));
}

export function getAmountsFromLiquidity(
  liquidity: BigNumber,
  sqrtPriceCurrentX64: BigNumber,
  sqrtPriceX64A: BigNumber,
  sqrtPriceX64B: BigNumber,
  roundUp: boolean
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  const liquidityBN = new BN(liquidity.toString());
  const sqrtPriceCurrentX64BN = new BN(sqrtPriceCurrentX64.toString());
  let sqrtPriceX64ABN = new BN(sqrtPriceX64A.toString());
  let sqrtPriceX64BBN = new BN(sqrtPriceX64B.toString());
  if (sqrtPriceX64ABN.gt(sqrtPriceX64BBN)) {
    [sqrtPriceX64ABN, sqrtPriceX64BBN] = [sqrtPriceX64BBN, sqrtPriceX64ABN];
  }

  if (sqrtPriceCurrentX64BN.lte(sqrtPriceX64ABN)) {
    return {
      tokenAmountA: new BigNumber(
        getTokenAmountAFromLiquidity(
          sqrtPriceX64ABN,
          sqrtPriceX64BBN,
          liquidityBN,
          roundUp
        ).toString()
      ),
      tokenAmountB: new BigNumber(0),
    };
  }
  if (sqrtPriceCurrentX64BN.lt(sqrtPriceX64BBN)) {
    const amountA = new BigNumber(
      getTokenAmountAFromLiquidity(
        sqrtPriceCurrentX64BN,
        sqrtPriceX64BBN,
        liquidityBN,
        roundUp
      ).toString()
    );
    const amountB = new BigNumber(
      getTokenAmountBFromLiquidity(
        sqrtPriceX64ABN,
        sqrtPriceCurrentX64BN,
        liquidityBN,
        roundUp
      ).toString()
    );
    return { tokenAmountA: amountA, tokenAmountB: amountB };
  }
  return {
    tokenAmountA: new BigNumber(0),
    tokenAmountB: new BigNumber(
      getTokenAmountBFromLiquidity(
        sqrtPriceX64ABN,
        sqrtPriceX64BBN,
        liquidityBN,
        roundUp
      ).toString()
    ),
  };
}

export function getAmountsFromLiquidityWithSlippage(
  sqrtPriceCurrentX64: BigNumber,
  sqrtPriceX64A: BigNumber,
  sqrtPriceX64B: BigNumber,
  liquidity: BigNumber,
  amountMax: boolean,
  roundUp: boolean,
  amountSlippage: number
) {
  const { tokenAmountA: amountA, tokenAmountB: amountB } =
    getAmountsFromLiquidity(
      sqrtPriceCurrentX64,
      sqrtPriceX64A,
      sqrtPriceX64B,
      liquidity,
      roundUp
    );
  const coefficient = amountMax ? 1 + amountSlippage : 1 - amountSlippage;

  const amount0Slippage = new BN(amountA.toString()).muln(coefficient);
  const amount1Slippage = new BN(amountB.toString()).muln(coefficient);
  return {
    amountSlippageA: new BigNumber(amount0Slippage.toString()),
    amountSlippageB: new BigNumber(amount1Slippage.toString()),
  };
}

export function getTokenAmountAFromLiquidity(
  sqrtPriceX64A: BN,
  sqrtPriceX64B: BN,
  liquidity: BN,
  roundUp: boolean
): BN {
  let newSqrtPriceX64A = new BN(sqrtPriceX64A);
  let newSqrtPriceX64B = new BN(sqrtPriceX64B);
  if (newSqrtPriceX64A.gt(sqrtPriceX64B)) {
    newSqrtPriceX64A = sqrtPriceX64B;
    newSqrtPriceX64B = sqrtPriceX64A;
  }

  if (!newSqrtPriceX64A.gt(ZERO)) {
    throw new Error('newSqrtPriceX64A must greater than 0');
  }

  const numerator1 = liquidity.ushln(U64Resolution);
  const numerator2 = newSqrtPriceX64B.sub(newSqrtPriceX64A);

  return roundUp
    ? mulDivRoundingUp(
        mulDivCeil(numerator1, numerator2, newSqrtPriceX64B),
        ONE,
        newSqrtPriceX64A
      )
    : mulDivFloor(numerator1, numerator2, newSqrtPriceX64B).div(
        newSqrtPriceX64A
      );
}

export function getTokenAmountBFromLiquidity(
  sqrtPriceX64A: BN,
  sqrtPriceX64B: BN,
  liquidity: BN,
  roundUp: boolean
): BN {
  let newSqrtPriceX64A = new BN(sqrtPriceX64A);
  let newSqrtPriceX64B = new BN(sqrtPriceX64B);
  if (sqrtPriceX64A.gt(sqrtPriceX64B)) {
    newSqrtPriceX64A = sqrtPriceX64B;
    newSqrtPriceX64B = sqrtPriceX64A;
    // [sqrtPriceX64A, sqrtPriceX64B] = [sqrtPriceX64B, sqrtPriceX64A];
  }
  if (!sqrtPriceX64A.gt(ZERO)) {
    throw new Error('sqrtPriceX64A must greater than 0');
  }

  return roundUp
    ? mulDivCeil(liquidity, newSqrtPriceX64B.sub(newSqrtPriceX64A), Q64)
    : mulDivFloor(liquidity, newSqrtPriceX64B.sub(newSqrtPriceX64A), Q64);
}

export function mulDivRoundingUp(a: BN, b: BN, denominator: BN): BN {
  const numerator = a.mul(b);
  let result = numerator.div(denominator);
  if (!numerator.mod(denominator).eq(ZERO)) {
    result = result.add(ONE);
  }
  return result;
}

export function mulDivFloor(a: BN, b: BN, denominator: BN): BN {
  if (denominator.eq(ZERO)) {
    throw new Error('division by 0');
  }
  return a.mul(b).div(denominator);
}

export function mulDivCeil(a: BN, b: BN, denominator: BN): BN {
  if (denominator.eq(ZERO)) {
    throw new Error('division by 0');
  }
  const numerator = a.mul(b).add(denominator.sub(ONE));
  return numerator.div(denominator);
}

export function x64ToDecimal(num: BN, decimalPlaces?: number): Decimal {
  return new Decimal(num.toString())
    .div(Decimal.pow(2, 64))
    .toDecimalPlaces(decimalPlaces);
}

export function decimalToX64(num: Decimal): BN {
  return new BN(num.mul(Decimal.pow(2, 64)).floor().toFixed());
}

export function wrappingSubU128(n0: BN, n1: BN): BN {
  return n0.add(Q128).sub(n1).mod(Q128);
}
