/* eslint-disable no-param-reassign */
import BN from 'bn.js';
import {
  checkIfAccountParser,
  ParserType,
  SolanaFMParser,
} from '@solanafm/explorer-kit';
import { PRICE_PRECISION, QUOTE_PRECISION, TEN } from './constants';
import { OraclePriceData } from './types';
import { pythSolanaReceiverIdlItem } from './idls';

type PriceFeedMessage = {
  feedId: number[];
  price: string;
  conf: string;
  exponent: number;
  publishTime: string;
  prevPublishTime: string;
  emaPrice: string;
  emaConf: string;
};

const parser = new SolanaFMParser(
  pythSolanaReceiverIdlItem,
  pythSolanaReceiverIdlItem.programId.toString()
);

export function getPythPullOraclePriceDataFromBuffer(
  buffer: Buffer,
  multiple: BN,
  stableCoin: boolean
): OraclePriceData {
  const eventParser = parser.createParser(ParserType.ACCOUNT);
  if (!eventParser || !checkIfAccountParser(eventParser))
    throw new Error('Failed to create event parser Pyth pull');
  const parsedAccount = eventParser.parseAccount(buffer.toString('base64'));
  const priceData = parsedAccount?.data?.priceMessage as PriceFeedMessage;
  const postedSlot = parsedAccount?.data?.postedSlot as BN;
  if (!priceData || !postedSlot)
    throw new Error('Failed to parseAccount Pyth pull');
  const confidence = convertPythPrice(
    new BN(priceData.conf),
    priceData.exponent,
    multiple
  );
  let price = convertPythPrice(
    new BN(priceData.price),
    priceData.exponent,
    multiple
  );
  if (stableCoin) {
    price = getStableCoinPrice(price, confidence);
  }

  return {
    price,
    slot: postedSlot,
    confidence,
    twap: convertPythPrice(
      new BN(priceData.price),
      priceData.exponent,
      multiple
    ),
    twapConfidence: convertPythPrice(
      new BN(priceData.price),
      priceData.exponent,
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
