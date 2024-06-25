import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { OraclePriceData } from './types';
import { PRICE_PRECISION, TEN } from './constants';
import { aggregatorAccountStruct } from '../../switchboard/structs';

export function getSwitchboardOraclePriceDataFromBuffer(
  buffer: Buffer
): OraclePriceData {
  const [aggregatorAccountData] = aggregatorAccountStruct.deserialize(buffer);

  const price = convertSwitchboardDecimal(
    aggregatorAccountData.latestConfirmedRound.result
  );

  const confidence = BN.max(
    convertSwitchboardDecimal(
      aggregatorAccountData.latestConfirmedRound.stdDeviation
    ),
    price.divn(1000)
  );

  const hasSufficientNumberOfDataPoints =
    aggregatorAccountData.latestConfirmedRound.numSuccess >=
    aggregatorAccountData.minOracleResults;

  const slot = new BN(
    aggregatorAccountData.latestConfirmedRound.roundOpenSlot.toString()
  );
  return {
    price,
    slot,
    confidence,
    hasSufficientNumberOfDataPoints,
  };
}

function convertSwitchboardDecimal(switchboardDecimal: {
  scale: number;
  mantissa: BigNumber;
}): BN {
  const switchboardPrecision = TEN.pow(new BN(switchboardDecimal.scale));
  return new BN(switchboardDecimal.mantissa.toString(10), 10)
    .mul(PRICE_PRECISION)
    .div(switchboardPrecision);
}
