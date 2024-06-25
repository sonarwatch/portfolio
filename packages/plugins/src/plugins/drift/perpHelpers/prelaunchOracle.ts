import BN from 'bn.js';
import { OraclePriceData } from './types';
import { preLaunchOracleStruct } from '../struct';

export function getPreLaunchOraclePriceDataFromBuffer(
  buffer: Buffer
): OraclePriceData {
  const [prelaunchOracle] = preLaunchOracleStruct.deserialize(buffer);

  return {
    price: new BN(prelaunchOracle.price.toString(10), 10),
    slot: new BN(prelaunchOracle.ammLastUpdateSlot.toString(10), 10),
    confidence: new BN(prelaunchOracle.confidence.toString(10), 10),
    hasSufficientNumberOfDataPoints: true,
    maxPrice: new BN(prelaunchOracle.maxPrice.toString(10), 10),
  };
}
