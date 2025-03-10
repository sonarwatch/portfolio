/* eslint-disable no-param-reassign */
import BN from 'bn.js';
import { parsePriceData } from '../../../utils/solana/pyth/helpersOld';
import { PRICE_PRECISION, QUOTE_PRECISION, TEN } from './constants';
import { OraclePriceData } from './types';
import { pythLazerOracleStruct } from '../struct';

export function getPythOraclePriceDataFromBuffer(
  buffer: Buffer,
  multiple: BN,
  stableCoin: boolean
): OraclePriceData {
  const priceData = parsePriceData(buffer);
  const confidence = convertPythPrice(
    priceData.confidence || 0,
    priceData.exponent,
    multiple
  );
  const minPublishers = Math.min(priceData.numComponentPrices, 3);
  let price = convertPythPrice(
    priceData.aggregate.price,
    priceData.exponent,
    multiple
  );
  if (stableCoin) {
    price = getStableCoinPrice(price, confidence);
  }

  return {
    price,
    slot: new BN(priceData.lastSlot.toString()),
    confidence,
    twap: convertPythPrice(
      priceData.emaPrice.value,
      priceData.exponent,
      multiple
    ),
    twapConfidence: convertPythPrice(
      priceData.emaConfidence.value,
      priceData.exponent,
      multiple
    ),
    hasSufficientNumberOfDataPoints: priceData.numQuoters >= minPublishers,
  };
}

export function convertPythPrice(
  price: number,
  exponent: number,
  multiple: BN
): BN {
  exponent = Math.abs(exponent);
  const pythPrecision = TEN.pow(new BN(exponent).abs()).div(multiple);
  return new BN(price * 10 ** exponent).mul(PRICE_PRECISION).div(pythPrecision);
}

const fiveBPS = new BN(500);
function getStableCoinPrice(price: BN, confidence: BN): BN {
  if (price.sub(QUOTE_PRECISION).abs().lt(BN.min(confidence, fiveBPS))) {
    return QUOTE_PRECISION;
  }
  return price;
}

export function pythLazerPriceToOraclePrice(buffer: Buffer): OraclePriceData {
  const pythLazer = pythLazerOracleStruct.deserialize(buffer)[0];

  const adjustedExp = pythLazer.exponent + 6;
  return {
    price: new BN(pythLazer.price.shiftedBy(adjustedExp).toNumber()),
    slot: new BN(pythLazer.postedSlot.toNumber()),
    confidence: new BN(pythLazer.conf.toNumber()),
    hasSufficientNumberOfDataPoints: true,
  };
}
