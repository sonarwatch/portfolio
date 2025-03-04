/* eslint-disable max-classes-per-file */
import BN from 'bn.js';

export type OraclePriceData = {
  price: BN;
  slot: BN;
  confidence: BN;
  hasSufficientNumberOfDataPoints: boolean;
  twap?: BN;
  twapConfidence?: BN;
  maxPrice?: BN; // pre-launch markets only
};

export class PositionDirection {
  static readonly LONG = { long: {} };
  static readonly SHORT = { short: {} };
}

export class SwapDirection {
  static readonly ADD = { add: {} };
  static readonly REMOVE = { remove: {} };
}

export type AssetType = 'quote' | 'base';

export function isVariant(object: object, type: string) {
  // eslint-disable-next-line no-prototype-builtins
  return object.hasOwnProperty(type);
}
