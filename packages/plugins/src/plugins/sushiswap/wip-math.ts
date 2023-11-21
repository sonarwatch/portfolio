import BigNumber from 'bignumber.js';

const Q128 = BigInt(BigNumber(2).pow(128).toString());
const Q256 = BigInt(BigNumber(2).pow(256).toString());

export function getTokenAmountsFromLiquidity(
  liquidity: BigNumber,
  tickCurrentIndex: number,
  tickLowerIndex: number,
  tickUpperIndex: number,
  feeGrowthOutsideLower: FeeGrowthOutside,
  feeGrowthOutsideUpper: FeeGrowthOutside,
  feeGrowthGlobal0X128: bigint,
  feeGrowthGlobal1X128: bigint
) {
  const feeGrowthInside = getFeeGrowthInside(
    feeGrowthOutsideLower,
    feeGrowthOutsideUpper,
    tickLowerIndex,
    tickUpperIndex,
    tickCurrentIndex,
    feeGrowthGlobal0X128,
    feeGrowthGlobal1X128
  );
  return getTokensOwed(
    feeGrowthInside[0],
    feeGrowthInside[1],
    BigInt(liquidity.toString()),
    feeGrowthInside[0],
    feeGrowthInside[1]
  );
}

export function getTokensOwed(
  feeGrowthInside0LastX128: bigint,
  feeGrowthInside1LastX128: bigint,
  liquidity: bigint,
  feeGrowthInside0X128: bigint,
  feeGrowthInside1X128: bigint
) {
  const tokensOwed0 =
    (subIn256(feeGrowthInside0X128, feeGrowthInside0LastX128) * liquidity) /
    Q128;

  const tokensOwed1 =
    (subIn256(feeGrowthInside1X128, feeGrowthInside1LastX128) * liquidity) /
    Q128;

  return [tokensOwed0, tokensOwed1] as const;
}

function subIn256(x: bigint, y: bigint): bigint {
  const difference = x - y;

  if (difference < BigInt(0)) {
    return Q256 + difference;
  }
  return difference;
}

interface FeeGrowthOutside {
  feeGrowthOutside0X128: bigint;
  feeGrowthOutside1X128: bigint;
}

function getFeeGrowthInside(
  feeGrowthOutsideLower: FeeGrowthOutside,
  feeGrowthOutsideUpper: FeeGrowthOutside,
  tickLower: number,
  tickUpper: number,
  tickCurrent: number,
  feeGrowthGlobal0X128: bigint,
  feeGrowthGlobal1X128: bigint
) {
  let feeGrowthBelow0X128: bigint;
  let feeGrowthBelow1X128: bigint;
  if (tickCurrent >= tickLower) {
    feeGrowthBelow0X128 = feeGrowthOutsideLower.feeGrowthOutside0X128;
    feeGrowthBelow1X128 = feeGrowthOutsideLower.feeGrowthOutside1X128;
  } else {
    feeGrowthBelow0X128 = subIn256(
      feeGrowthGlobal0X128,
      feeGrowthOutsideLower.feeGrowthOutside0X128
    );
    feeGrowthBelow1X128 = subIn256(
      feeGrowthGlobal1X128,
      feeGrowthOutsideLower.feeGrowthOutside1X128
    );
  }

  let feeGrowthAbove0X128: bigint;
  let feeGrowthAbove1X128: bigint;
  if (tickCurrent < tickUpper) {
    feeGrowthAbove0X128 = feeGrowthOutsideUpper.feeGrowthOutside0X128;
    feeGrowthAbove1X128 = feeGrowthOutsideUpper.feeGrowthOutside1X128;
  } else {
    feeGrowthAbove0X128 = subIn256(
      feeGrowthGlobal0X128,
      feeGrowthOutsideUpper.feeGrowthOutside0X128
    );
    feeGrowthAbove1X128 = subIn256(
      feeGrowthGlobal1X128,
      feeGrowthOutsideUpper.feeGrowthOutside1X128
    );
  }

  return [
    subIn256(
      subIn256(feeGrowthGlobal0X128, feeGrowthBelow0X128),
      feeGrowthAbove0X128
    ),
    subIn256(
      subIn256(feeGrowthGlobal1X128, feeGrowthBelow1X128),
      feeGrowthAbove1X128
    ),
  ] as const;
}
