import BN from 'bn.js';
import { OraclePriceData } from './types';
import { PRICE_PRECISION_EXP } from './constants';
import { toBN } from '../../../utils/misc/toBN';
import { pullFeedAccountDataStruct } from '../../switchboard/structs';

const SB_PRECISION_EXP = new BN(18);
const SB_PRECISION = new BN(10).pow(SB_PRECISION_EXP.sub(PRICE_PRECISION_EXP));

export function getSwitchboardOnDemandOraclePriceDataFromBuffer(
  buffer: Buffer
): OraclePriceData {
  const [pullFeedAccountData] = pullFeedAccountDataStruct.deserialize(buffer);

  return {
    price: toBN(pullFeedAccountData.result.value).div(SB_PRECISION),
    slot: toBN(pullFeedAccountData.result.slot),
    confidence: toBN(pullFeedAccountData.result.range).div(SB_PRECISION),
    hasSufficientNumberOfDataPoints: true,
  };
}
