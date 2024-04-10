import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import { Bank } from './structs/Bank';

export function wrappedI80F48toBigNumber(
  { value }: { value: BigNumber },
  scaleDecimal = 0
): BigNumber {
  if (!value) return new BigNumber(0);

  const numbers = new Decimal(
    `${value.isNegative() ? '-' : ''}0b${value.abs().toString(2)}p-48`
  ).dividedBy(10 ** scaleDecimal);
  return new BigNumber(numbers.toString());
}

function getTotalLiabilityQuantity(bank: Bank) {
  return wrappedI80F48toBigNumber(bank.totalLiabilityShares).times(
    wrappedI80F48toBigNumber(bank.liabilityShareValue)
  );
}
function getTotalAssetQuantity(bank: Bank) {
  return wrappedI80F48toBigNumber(bank.totalAssetShares).times(
    wrappedI80F48toBigNumber(bank.assetShareValue)
  );
}
function computeUtilizationRate(bank: Bank) {
  const assets = getTotalAssetQuantity(bank);
  const liabilities = getTotalLiabilityQuantity(bank);
  if (assets.isZero()) return new BigNumber(0);
  return liabilities.div(assets);
}
function computeBaseInterestRate(bank: Bank) {
  const { optimalUtilizationRate, plateauInterestRate, maxInterestRate } =
    bank.config.interestRateConfig;
  const fOptimalUtilizationRate = wrappedI80F48toBigNumber(
    optimalUtilizationRate
  );
  const fPlateauInterestRate = wrappedI80F48toBigNumber(plateauInterestRate);
  const fMaxInterestRate = wrappedI80F48toBigNumber(maxInterestRate);
  const utilizationRate = computeUtilizationRate(bank);

  if (utilizationRate.lte(fOptimalUtilizationRate)) {
    return utilizationRate
      .times(fPlateauInterestRate)
      .div(fOptimalUtilizationRate);
  }
  return utilizationRate
    .minus(fOptimalUtilizationRate)
    .div(new BigNumber(1).minus(fOptimalUtilizationRate))
    .times(fMaxInterestRate.minus(fPlateauInterestRate))
    .plus(fPlateauInterestRate);
}

export function computeInterestRates(bank: Bank): {
  lendingApr: number;
  borrowingApr: number;
} {
  const {
    insuranceFeeFixedApr,
    insuranceIrFee,
    protocolFixedFeeApr,
    protocolIrFee,
  } = bank.config.interestRateConfig;

  const fixedFee = wrappedI80F48toBigNumber(insuranceFeeFixedApr).plus(
    wrappedI80F48toBigNumber(protocolFixedFeeApr)
  );
  const rateFee = wrappedI80F48toBigNumber(insuranceIrFee).plus(
    wrappedI80F48toBigNumber(protocolIrFee)
  );

  const baseInterestRate = computeBaseInterestRate(bank);
  const utilizationRate = computeUtilizationRate(bank);

  const lendingRate = baseInterestRate.times(utilizationRate);
  const borrowingRate = baseInterestRate
    .times(new BigNumber(1).plus(rateFee))
    .plus(fixedFee);

  const lendingApr = lendingRate.toNumber();
  const borrowingApr = borrowingRate.toNumber();

  return { lendingApr, borrowingApr };
}
