/* eslint-disable no-bitwise */
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';

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

const fromX64Decimal = (num: Decimal) => num.times(Decimal.pow(2, -64));
const toX64Decimal = (num: Decimal) => num.times(Decimal.pow(2, 64));

export function getTokenAmountsFromLiquidity(
  liquidity: BigNumber,
  tickCurrentIndex: number,
  tickLowerIndex: number,
  tickUpperIndex: number,
  roundUp: boolean
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  const currentSqrtPrice = tickIndexToSqrtPriceX64(tickCurrentIndex);
  const lowerSqrtPrice = tickIndexToSqrtPriceX64(tickLowerIndex);
  const upperSqrtPrice = tickIndexToSqrtPriceX64(tickUpperIndex);

  const decLiquidity = new Decimal(liquidity.toString());
  const currentPrice = new Decimal(currentSqrtPrice.toString());
  const lowerPrice = new Decimal(lowerSqrtPrice.toString());
  const upperPrice = new Decimal(upperSqrtPrice.toString());
  let tokenA;
  let tokenB;

  if (currentSqrtPrice.lt(lowerSqrtPrice)) {
    // x = L * (pb - pa) / (pa * pb)
    tokenA = toX64Decimal(decLiquidity)
      .times(upperPrice.sub(lowerPrice))
      .div(lowerPrice.mul(upperPrice));
    tokenB = new Decimal(0);
  } else if (currentSqrtPrice.lt(upperSqrtPrice)) {
    // x = L * (pb - p) / (p * pb)
    // y = L * (p - pa)
    tokenA = toX64Decimal(decLiquidity)
      .times(upperPrice.sub(currentPrice))
      .div(currentPrice.mul(upperPrice));
    tokenB = fromX64Decimal(decLiquidity.mul(currentPrice.sub(lowerPrice)));
  } else {
    // y = L * (pb - pa)
    tokenA = new Decimal(0);
    tokenB = fromX64Decimal(decLiquidity.mul(upperPrice.sub(lowerPrice)));
  }

  if (roundUp) {
    return {
      tokenAmountA: new BigNumber(tokenA.ceil().toString()),
      tokenAmountB: new BigNumber(tokenB.ceil().toString()),
    };
  }

  return {
    tokenAmountA: new BigNumber(tokenA.floor().toString()),
    tokenAmountB: new BigNumber(tokenB.floor().toString()),
  };
}
