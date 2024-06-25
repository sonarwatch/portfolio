import BN from 'bn.js';
import { PerpMarket, PerpPosition } from '../struct';
import {
  AMM_RESERVE_PRECISION,
  AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO,
  AMM_TO_QUOTE_PRECISION_RATIO,
  FUNDING_RATE_BUFFER_PRECISION,
  ONE,
  PRICE_PRECISION,
  ZERO,
} from './constants';
import { OraclePriceData, PositionDirection } from './types';
import {
  calculateAmmReservesAfterSwap,
  calculateUpdatedAMM,
  calculateUpdatedAMMSpreadReserves,
  getSwapDirection,
} from './amm';
import { calculateBaseAssetValueWithOracle } from './margin';

export function calculateBaseAssetValue(
  market: PerpMarket,
  userPosition: PerpPosition,
  oraclePriceData: OraclePriceData,
  useSpread = true,
  skipUpdate = false
): BN {
  if (userPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }

  const directionToClose = findDirectionToClose(userPosition);
  let prepegAmm: Parameters<typeof calculateAmmReservesAfterSwap>[0];

  if (!skipUpdate) {
    if (market.amm.baseSpread > 0 && useSpread) {
      const { baseAssetReserve, quoteAssetReserve, sqrtK, newPeg } =
        calculateUpdatedAMMSpreadReserves(
          market.amm,
          directionToClose,
          oraclePriceData
        );
      prepegAmm = {
        baseAssetReserve,
        quoteAssetReserve,
        sqrtK,
        pegMultiplier: newPeg,
      };
    } else {
      prepegAmm = calculateUpdatedAMM(market.amm, oraclePriceData);
    }
  } else {
    prepegAmm = market.amm;
  }

  const [newQuoteAssetReserve] = calculateAmmReservesAfterSwap(
    prepegAmm,
    'base',
    userPosition.baseAssetAmount.abs(),
    getSwapDirection('base', directionToClose)
  );

  switch (directionToClose) {
    case PositionDirection.SHORT:
      return prepegAmm.quoteAssetReserve
        .sub(newQuoteAssetReserve)
        .mul(prepegAmm.pegMultiplier)
        .div(AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO);

    case PositionDirection.LONG:
      return newQuoteAssetReserve
        .sub(prepegAmm.quoteAssetReserve)
        .mul(prepegAmm.pegMultiplier)
        .div(AMM_TIMES_PEG_TO_QUOTE_PRECISION_RATIO)
        .add(ONE);

    default:
      throw new Error('Failed to calculateBaseAssetValue');
  }
}

/**
 * calculatePositionPNL
 * = BaseAssetAmount * (Avg Exit Price - Avg Entry Price)
 * @param market
 * @param PerpPosition
 * @param withFunding (adds unrealized funding payment pnl to result)
 * @param oraclePriceData
 * @returns BaseAssetAmount : Precision QUOTE_PRECISION
 */
export function calculatePositionPNL(
  market: PerpMarket,
  perpPosition: PerpPosition,
  oraclePriceData: OraclePriceData,
  withFunding = false
): BN {
  if (perpPosition.baseAssetAmount.eq(ZERO)) {
    return perpPosition.quoteAssetAmount;
  }

  const baseAssetValue = calculateBaseAssetValueWithOracle(
    market,
    perpPosition,
    oraclePriceData
  );

  const baseAssetValueSign = perpPosition.baseAssetAmount.isNeg()
    ? new BN(-1)
    : new BN(1);
  let pnl = baseAssetValue
    .mul(baseAssetValueSign)
    .add(perpPosition.quoteAssetAmount);

  if (withFunding) {
    const fundingRatePnL = calculatePositionFundingPNL(market, perpPosition);

    pnl = pnl.add(fundingRatePnL);
  }

  return pnl;
}

/**
 *
 * @param market
 * @param PerpPosition
 * @returns // QUOTE_PRECISION
 */
export function calculatePositionFundingPNL(
  market: PerpMarket,
  perpPosition: PerpPosition
): BN {
  if (perpPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }

  let ammCumulativeFundingRate: BN;
  if (perpPosition.baseAssetAmount.gt(ZERO)) {
    ammCumulativeFundingRate = market.amm.cumulativeFundingRateLong;
  } else {
    ammCumulativeFundingRate = market.amm.cumulativeFundingRateShort;
  }

  const perPositionFundingRate = ammCumulativeFundingRate
    .sub(perpPosition.lastCumulativeFundingRate)
    .mul(perpPosition.baseAssetAmount)
    .div(AMM_RESERVE_PRECISION)
    .div(FUNDING_RATE_BUFFER_PRECISION)
    .mul(new BN(-1));

  return perPositionFundingRate;
}

export function positionIsAvailable(position: PerpPosition): boolean {
  return (
    position.baseAssetAmount.eq(ZERO) &&
    position.openOrders === 0 &&
    position.quoteAssetAmount.eq(ZERO) &&
    position.lpShares.eq(ZERO)
  );
}

/**
 *
 * @param userPosition
 * @returns Precision: PRICE_PRECISION (10^6)
 */
export function calculateBreakEvenPrice(userPosition: PerpPosition): BN {
  if (userPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }

  return userPosition.quoteBreakEvenAmount
    .mul(PRICE_PRECISION)
    .mul(AMM_TO_QUOTE_PRECISION_RATIO)
    .div(userPosition.baseAssetAmount)
    .abs();
}

/**
 *
 * @param userPosition
 * @returns Precision: PRICE_PRECISION (10^6)
 */
export function calculateEntryPrice(userPosition: PerpPosition): BN {
  if (userPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }

  return userPosition.quoteEntryAmount
    .mul(PRICE_PRECISION)
    .mul(AMM_TO_QUOTE_PRECISION_RATIO)
    .div(userPosition.baseAssetAmount)
    .abs();
}

/**
 *
 * @param userPosition
 * @returns Precision: PRICE_PRECISION (10^10)
 */
export function calculateCostBasis(
  userPosition: PerpPosition,
  includeSettledPnl = false
): BN {
  if (userPosition.baseAssetAmount.eq(ZERO)) {
    return ZERO;
  }

  return userPosition.quoteAssetAmount
    .add(includeSettledPnl ? userPosition.settledPnl : ZERO)
    .mul(PRICE_PRECISION)
    .mul(AMM_TO_QUOTE_PRECISION_RATIO)
    .div(userPosition.baseAssetAmount)
    .abs();
}

export function findDirectionToClose(
  userPosition: PerpPosition
): PositionDirection {
  return userPosition.baseAssetAmount.gt(ZERO)
    ? PositionDirection.SHORT
    : PositionDirection.LONG;
}

export function positionCurrentDirection(
  userPosition: PerpPosition
): PositionDirection {
  return userPosition.baseAssetAmount.gte(ZERO)
    ? PositionDirection.LONG
    : PositionDirection.SHORT;
}

export function isEmptyPosition(userPosition: PerpPosition): boolean {
  return userPosition.baseAssetAmount.eq(ZERO) && userPosition.openOrders === 0;
}

export function hasOpenOrders(position: PerpPosition): boolean {
  return (
    position.openOrders !== 0 ||
    !position.openBids.eq(ZERO) ||
    !position.openAsks.eq(ZERO)
  );
}
