import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { CustodyInfo } from '../types';
import { Position, Side } from './structs';

export const USD_POWER = new BN(1_000_000);
export const USD_POWER_BIGN = new BigNumber(1_000_000);
const BPS_POWER = new BN(10_000);
const DBPS_POWER = new BN(100_000);
const RATE_POWER = new BN(1_000_000_000);
const HOURS_IN_A_YEAR = 24 * 365;

enum BorrowRateMechanism {
  Linear,
  Jump,
}

export type CustodyBn = Omit<
  CustodyInfo,
  | 'pricing'
  | 'decreasePositionBps'
  | 'fundingRateState'
  | 'jumpRateState'
  | 'assets'
> & {
  decreasePositionBps: BN;
  pricing: {
    tradeImpactFeeScalar: BN;
    maxLeverage: BN;
  };
  fundingRateState: {
    hourlyFundingBps: BN;
    lastUpdate: BN;
    cumulativeInterestRate: BN;
  };
  jumpRateState: {
    minRateBps: BN;
    maxRateBps: BN;
    targetRateBps: BN;
    targetUtilizationRate: BN;
  };
  assets: {
    feesReserves: BN;
    owned: BN;
    locked: BN;
    guaranteedUsd: BN;
    globalShortSizes: BN;
    globalShortAveragePrices: BN;
  };
};

export type PositionBn = Omit<
  Position,
  'price' | 'collateralUsd' | 'sizeUsd' | 'cumulativeInterestSnapshot'
> & {
  price: BN;
  collateralUsd: BN;
  sizeUsd: BN;
  cumulativeInterestSnapshot: BN;
};

export function custodyToBN(custody: CustodyInfo): CustodyBn {
  return {
    ...custody,
    decreasePositionBps: new BN(custody.decreasePositionBps),
    pricing: {
      tradeImpactFeeScalar: new BN(custody.pricing.tradeSpreadLong),
      maxLeverage: new BN(custody.pricing.maxLeverage),
    },
    fundingRateState: {
      hourlyFundingBps: new BN(
        custody.fundingRateState.hourlyFundingBps.toString()
      ),
      lastUpdate: new BN(custody.fundingRateState.lastUpdate.toString()),
      cumulativeInterestRate: new BN(
        custody.fundingRateState.cumulativeInterestRate.toString()
      ),
    },
    jumpRateState: {
      maxRateBps: new BN(custody.jumpRateState.maxRateBps.toString()),
      minRateBps: new BN(custody.jumpRateState.minRateBps.toString()),
      targetRateBps: new BN(custody.jumpRateState.targetRateBps.toString()),
      targetUtilizationRate: new BN(
        custody.jumpRateState.targetUtilizationRate.toString()
      ),
    },
    assets: {
      feesReserves: new BN(custody.assets.feesReserves),
      owned: new BN(custody.assets.owned),
      locked: new BN(custody.assets.locked),
      guaranteedUsd: new BN(custody.assets.guaranteedUsd),
      globalShortSizes: new BN(custody.assets.globalShortSizes),
      globalShortAveragePrices: new BN(custody.assets.globalShortAveragePrices),
    },
  };
}

export function positionToBn(position: Position): PositionBn {
  return {
    ...position,
    price: new BN(position.price.toString()),
    collateralUsd: new BN(position.collateralUsd.toString()),
    sizeUsd: new BN(position.sizeUsd.toString()),
    cumulativeInterestSnapshot: new BN(
      position.cumulativeInterestSnapshot.toString()
    ),
  };
}

const divCeil = (a: BN, b: BN) => {
  const dm = a.divmod(b);
  // Fast case - exact division
  if (dm.mod.isZero()) return dm.div;
  // Round up
  return dm.div.ltn(0) ? dm.div.isubn(1) : dm.div.iaddn(1);
};

const getImpactFeeBps = (amount: BN, tradeImpactFeeScalar: BN) =>
  tradeImpactFeeScalar.eqn(0)
    ? new BN(0)
    : divCeil(amount.mul(BPS_POWER), tradeImpactFeeScalar);

export const getFeeAmount = (
  baseFeeBps: BN,
  amount: BN,
  tradeImpactFeeScalar: BN
) => {
  if (amount.eqn(0)) {
    return new BN(0);
  }
  const impactFeeCoefficientBps = getImpactFeeBps(amount, tradeImpactFeeScalar);
  const totalFeeBps = impactFeeCoefficientBps.add(baseFeeBps);

  return amount.mul(totalFeeBps).div(BPS_POWER);
};

function getBorrowRateMechanism(custody: CustodyBn) {
  if (!custody.fundingRateState.hourlyFundingBps.eq(new BN(0))) {
    return BorrowRateMechanism.Linear;
  }
  return BorrowRateMechanism.Jump;
}

const getHourlyBorrowRate = (custody: CustodyBn) => {
  const borrowRateMechanism = getBorrowRateMechanism(custody);

  if (borrowRateMechanism === BorrowRateMechanism.Linear) {
    const hourlyFundingRate = custody.fundingRateState.hourlyFundingBps
      .mul(RATE_POWER)
      .div(DBPS_POWER);

    return custody.assets.owned.gtn(0) && custody.assets.locked.gtn(0)
      ? custody.assets.locked.mul(hourlyFundingRate).div(custody.assets.owned)
      : new BN(0);
  }
  const { minRateBps, maxRateBps, targetRateBps, targetUtilizationRate } =
    custody.jumpRateState;

  const utilizationRate =
    custody.assets.owned.gtn(0) && custody.assets.locked.gtn(0)
      ? custody.assets.locked.mul(RATE_POWER).div(custody.assets.owned)
      : new BN(0);

  let yearlyRate: BN;

  if (utilizationRate.lte(targetUtilizationRate)) {
    yearlyRate = targetRateBps
      .sub(minRateBps)
      .mul(utilizationRate)
      .div(targetUtilizationRate)
      .add(minRateBps)
      .mul(RATE_POWER)
      .div(BPS_POWER);
  } else {
    const rateDiff = maxRateBps.sub(targetRateBps);
    const utilDiff = utilizationRate.sub(targetUtilizationRate);
    const denom = RATE_POWER.sub(targetUtilizationRate);

    yearlyRate = rateDiff
      .mul(utilDiff)
      .div(denom)
      .add(targetRateBps)
      .mul(RATE_POWER)
      .div(BPS_POWER);
  }

  return yearlyRate.divn(HOURS_IN_A_YEAR);
};

const getCurrentFundingRate = (custody: CustodyBn, curtime: BN) => {
  if (custody.assets.owned.eqn(0)) return new BN(0);

  const interval = curtime.sub(custody.fundingRateState.lastUpdate);
  const currentFundingRate = getHourlyBorrowRate(custody);

  return currentFundingRate.mul(interval).div(new BN(3600));
};

const getCumulativeInterest = (custody: CustodyBn, curtime: BN) => {
  if (curtime.gt(custody.fundingRateState.lastUpdate)) {
    const fundingRate = getCurrentFundingRate(custody, curtime);
    return custody.fundingRateState.cumulativeInterestRate.add(fundingRate);
  }
  return custody.fundingRateState.cumulativeInterestRate;
};

const getFundingFee = (
  custody: CustodyBn,
  position: PositionBn,
  curtime: BN
) => {
  if (position.sizeUsd.eqn(0)) return new BN(0);

  const cumulativeInterest = getCumulativeInterest(custody, curtime);
  const positionInterest = cumulativeInterest.sub(
    position.cumulativeInterestSnapshot
  );

  return positionInterest.mul(position.sizeUsd).div(RATE_POWER);
};

export const getLiquidationPrice = (
  position: PositionBn,
  custody: CustodyBn,
  collateralCustody: CustodyBn,
  curtime: BN
): BN => {
  const sizeUsd = new BN(position.sizeUsd.toString());

  if (sizeUsd.eqn(0)) return new BN(0);

  const closePositionFeeUsd = getFeeAmount(
    custody.decreasePositionBps,
    sizeUsd,
    custody.pricing.tradeImpactFeeScalar
  );
  const fundingFeeUsd = getFundingFee(collateralCustody, position, curtime);
  const feeUsd = closePositionFeeUsd.add(fundingFeeUsd);

  const maxLossUsd = sizeUsd
    .mul(BPS_POWER)
    .div(custody.pricing.maxLeverage)
    .add(feeUsd);

  const marginUsd = position.collateralUsd;

  let maxPriceDiff = maxLossUsd.sub(marginUsd).abs();
  maxPriceDiff = maxPriceDiff.mul(position.price).div(sizeUsd);

  if (position.side === Side.Long) {
    if (maxLossUsd.gt(marginUsd)) {
      return position.price.add(maxPriceDiff);
    }
    return position.price.sub(maxPriceDiff);
  }
  if (maxLossUsd.gt(marginUsd)) {
    return position.price.sub(maxPriceDiff);
  }
  return position.price.add(maxPriceDiff);
};
