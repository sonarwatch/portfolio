import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { Pool, Position } from './structs';
import { Rounding } from '../dlmm/dlmmHelper';
import { cpammProgramId } from '../constants';

const LIQUIDITY_SCALE = 128;

export const getUnClaimReward = (
  poolState: Pool,
  positionState: Position
): {
  feeTokenA: BigNumber;
  feeTokenB: BigNumber;
  rewards: BigNumber[];
} => {
  const totalPositionLiquidity = positionState.unlockedLiquidity
    .plus(positionState.vestedLiquidity)
    .plus(positionState.permanentLockedLiquidity);

  const feeAPerTokenStored = new BN(
    Buffer.from(poolState.feeAPerLiquidity).reverse()
  ).sub(new BN(Buffer.from(positionState.feeAPerTokenCheckpoint).reverse()));

  const feeBPerTokenStored = new BN(
    Buffer.from(poolState.feeBPerLiquidity).reverse()
  ).sub(new BN(Buffer.from(positionState.feeBPerTokenCheckpoint).reverse()));

  const feeA = totalPositionLiquidity
    .times(feeAPerTokenStored.toString())
    .shiftedBy(LIQUIDITY_SCALE);
  const feeB = totalPositionLiquidity
    .times(feeBPerTokenStored.toString())
    .shiftedBy(LIQUIDITY_SCALE);

  return {
    feeTokenA: positionState.feeAPending.plus(feeA),
    feeTokenB: positionState.feeBPending.plus(feeB),
    rewards:
      positionState.rewardInfos.length > 0
        ? positionState.rewardInfos.map((item) => item.rewardPendings)
        : [],
  };
};

// L = Δa * √P_upper * √P_lower / (√P_upper - √P_lower)
// Δa = L * (√P_upper - √P_lower) / √P_upper * √P_lower
export function getAmountAFromLiquidityDelta(
  liquidity: BigNumber,
  currentSqrtPrice: BigNumber, // current sqrt price
  maxSqrtPrice: BigNumber,
  rounding: Rounding
): BigNumber {
  // Q128.128
  const product = liquidity.times(maxSqrtPrice.minus(currentSqrtPrice));
  // Q128.128
  const denominator = currentSqrtPrice.times(maxSqrtPrice);
  // Q64.64
  if (rounding === Rounding.Up) {
    return new BigNumber(
      product
        .plus(denominator.minus(new BigNumber(1)))
        .div(denominator)
        .toString()
    );
  }
  return new BigNumber(product.dividedBy(denominator).toString());
}

// L = Δb / (√P_upper - √P_lower)
// Δb = L * (√P_upper - √P_lower)
export function getAmountBFromLiquidityDelta(
  liquidity: BigNumber,
  currentSqrtPrice: BigNumber, // current sqrt price,
  minSqrtPrice: BigNumber,
  rounding: Rounding
): BigNumber {
  // const one = new BigNumber(1).shiftedBy(-128);
  const one = new BigNumber(2).pow(128);
  const deltaPrice = currentSqrtPrice.minus(minSqrtPrice);
  const result = liquidity.times(deltaPrice); // Q128
  if (rounding === Rounding.Up) {
    return new BigNumber(result.plus(one.minus(1)).div(one));
  }
  // return result.shiftedBy(128);
  return result.dividedBy(one);
}

export function derivePositionAddress(positionNft: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('position'), positionNft.toBuffer()],
    cpammProgramId
  )[0];
}

// (sqrtPrice)^2 * 10 ** (base_decimal - quote_decimal) / 2^128
export const getPriceFromSqrtPrice = (
  sqrtPrice: BigNumber,
  tokenADecimal: number,
  tokenBDecimal: number
): string => {
  const decimalSqrtPrice = new Decimal(sqrtPrice.toString());
  const price = decimalSqrtPrice
    .mul(decimalSqrtPrice)
    .mul(new Decimal(10 ** (tokenADecimal - tokenBDecimal)))
    .div(Decimal.pow(2, 128))
    .toString();

  return price;
};
