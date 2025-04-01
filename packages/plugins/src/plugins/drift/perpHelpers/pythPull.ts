/* eslint-disable no-param-reassign */
import BN from 'bn.js';
import { PRICE_PRECISION, QUOTE_PRECISION, TEN } from './constants';
import { OraclePriceData } from './types';
import { toBN } from '../../../utils/misc/toBN';
import { priceUpdateV2Struct } from '../../../utils/solana/pyth/structs';

export function getPythPullOraclePriceDataFromBuffer(
  buffer: Buffer,
  multiple: BN,
  stableCoin: boolean
): OraclePriceData {
  const [{ priceMessage, postedSlot }] = priceUpdateV2Struct.deserialize(
    buffer,
    0
  );

  if (!priceMessage || !postedSlot)
    throw new Error('Failed to parseAccount Pyth pull');
  const confidence = convertPythPrice(
    toBN(priceMessage.conf.toNumber()),
    priceMessage.exponent,
    multiple
  );
  let price = convertPythPrice(
    toBN(priceMessage.price.toNumber()),
    priceMessage.exponent,
    multiple
  );
  if (stableCoin) {
    price = getStableCoinPrice(price, confidence);
  }

  return {
    price,
    slot: toBN(postedSlot),
    confidence,
    twap: convertPythPrice(
      toBN(priceMessage.price.toNumber()),
      priceMessage.exponent,
      multiple
    ),
    twapConfidence: convertPythPrice(
      toBN(priceMessage.price),
      priceMessage.exponent,
      multiple
    ),
    hasSufficientNumberOfDataPoints: true,
  };
}

export function convertPythPrice(
  price: BN,
  exponent: number,
  multiple: BN
): BN {
  exponent = Math.abs(exponent);
  const pythPrecision = TEN.pow(new BN(exponent).abs()).div(multiple);
  return price.mul(PRICE_PRECISION).div(pythPrecision);
}

const fiveBPS = new BN(500);
function getStableCoinPrice(price: BN, confidence: BN): BN {
  if (price.sub(QUOTE_PRECISION).abs().lt(BN.min(confidence, fiveBPS))) {
    return QUOTE_PRECISION;
  }
  return price;
}
