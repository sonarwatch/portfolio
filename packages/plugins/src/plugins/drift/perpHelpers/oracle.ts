import BN from 'bn.js';
import { AMM, HistoricalOracleData } from '../struct';
import { BID_ASK_SPREAD_PRECISION, FIVE_MINUTE, ONE, ZERO } from './constants';
import { OraclePriceData } from './types';

export function calculateLiveOracleTwap(
  histOracleData: HistoricalOracleData,
  oraclePriceData: OraclePriceData,
  now: BN,
  period: BN
): BN {
  let oracleTwap;
  if (period.eq(FIVE_MINUTE)) {
    oracleTwap = new BN(
      histOracleData.lastOraclePriceTwap5Min.toString(10),
      10
    );
  } else {
    // todo: assumes its fundingPeriod (1hr)
    // period = amm.fundingPeriod;
    oracleTwap = new BN(histOracleData.lastOraclePriceTwap.toString(10), 10);
  }

  const sinceLastUpdate = BN.max(
    ONE,
    now.sub(new BN(histOracleData.lastOraclePriceTwapTs.toString(10), 10))
  );
  const sinceStart = BN.max(ZERO, period.sub(sinceLastUpdate));

  const clampRange = oracleTwap.div(new BN(3));

  const clampedOraclePrice = BN.min(
    oracleTwap.add(clampRange),
    BN.max(oraclePriceData.price, oracleTwap.sub(clampRange))
  );

  const newOracleTwap = oracleTwap
    .mul(sinceStart)
    .add(clampedOraclePrice.mul(sinceLastUpdate))
    .div(sinceStart.add(sinceLastUpdate));

  return newOracleTwap;
}

export function calculateLiveOracleStd(
  amm: AMM,
  oraclePriceData: OraclePriceData,
  now: BN
): BN {
  const sinceLastUpdate = BN.max(
    ONE,
    now.sub(
      new BN(amm.historicalOracleData.lastOraclePriceTwapTs.toString(10), 10)
    )
  );
  const sinceStart = BN.max(ZERO, amm.fundingPeriod.sub(sinceLastUpdate));

  const liveOracleTwap = calculateLiveOracleTwap(
    amm.historicalOracleData,
    oraclePriceData,
    now,
    amm.fundingPeriod
  );

  const priceDeltaVsTwap = oraclePriceData.price.sub(liveOracleTwap).abs();

  const oracleStd = priceDeltaVsTwap.add(
    amm.oracleStd.mul(sinceStart).div(sinceStart.add(sinceLastUpdate))
  );

  return oracleStd;
}

export function getNewOracleConfPct(
  amm: AMM,
  oraclePriceData: OraclePriceData,
  reservePrice: BN,
  now: BN
): BN {
  const confInterval = oraclePriceData.confidence || ZERO;

  const sinceLastUpdate = BN.max(
    ZERO,
    now.sub(
      new BN(amm.historicalOracleData.lastOraclePriceTwapTs.toString(10), 10)
    )
  );
  let lowerBoundConfPct = amm.lastOracleConfPct;
  if (sinceLastUpdate.gt(ZERO)) {
    const lowerBoundConfDivisor = BN.max(
      new BN(21).sub(sinceLastUpdate),
      new BN(5)
    );
    lowerBoundConfPct = amm.lastOracleConfPct.sub(
      amm.lastOracleConfPct.div(lowerBoundConfDivisor)
    );
  }
  const confIntervalPct = confInterval
    .mul(BID_ASK_SPREAD_PRECISION)
    .div(reservePrice);

  const confIntervalPctResult = BN.max(confIntervalPct, lowerBoundConfPct);

  return confIntervalPctResult;
}
