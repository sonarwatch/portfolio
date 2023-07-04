import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import { BankInfo } from './types';

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

// AMELIORER LE PRINCIPE DENVOYER A CHAQUE FOIS LA BANK AUX FONCTIONS
// AMELIORER LE PRINCIPE DE UNWRAP LES I80F48 A CHAQUE FOIS

export function getInterestRates(bank: BankInfo): {
  lendingApr: number;
  borrowingApr: number;
} {
  const {
    insuranceFeeFixedApr,
    insuranceIrFee,
    protocolFixedFeeApr,
    protocolIrFee,
  } = bank.config.interestRateConfig;

  const rateFee = wrappedI80F48toBigNumber(insuranceFeeFixedApr).plus(
    wrappedI80F48toBigNumber(protocolFixedFeeApr)
  );
  const fixedFee = wrappedI80F48toBigNumber(insuranceIrFee).plus(
    wrappedI80F48toBigNumber(protocolIrFee)
  );

  const interestRate = interestRateCurve(bank);
  const utilizationRate = wrappedI80F48toBigNumber(bank.liabilityShareValue)
    .times(wrappedI80F48toBigNumber(bank.totalLiabilityShares))
    .div(
      wrappedI80F48toBigNumber(bank.assetShareValue).times(
        wrappedI80F48toBigNumber(bank.totalAssetShares)
      )
    );

  const lendingApy = interestRate.times(utilizationRate).toNumber();
  const borrowingApy = interestRate
    .times(new BigNumber(1).plus(rateFee))
    .plus(fixedFee)
    .toNumber();

  return { lendingApr: lendingApy, borrowingApr: borrowingApy };
}

function interestRateCurve(bank: BankInfo) {
  const { optimalUtilizationRate, plateauInterestRate, maxInterestRate } =
    bank.config.interestRateConfig;

  const utilizationRate = wrappedI80F48toBigNumber(bank.liabilityShareValue)
    .times(wrappedI80F48toBigNumber(bank.totalLiabilityShares))
    .div(
      wrappedI80F48toBigNumber(bank.assetShareValue).times(
        wrappedI80F48toBigNumber(bank.totalAssetShares)
      )
    );

  if (utilizationRate.lte(wrappedI80F48toBigNumber(optimalUtilizationRate))) {
    return utilizationRate
      .times(wrappedI80F48toBigNumber(plateauInterestRate))
      .div(wrappedI80F48toBigNumber(optimalUtilizationRate));
  }
  return utilizationRate
    .minus(wrappedI80F48toBigNumber(optimalUtilizationRate))
    .div(
      new BigNumber(1).minus(wrappedI80F48toBigNumber(optimalUtilizationRate))
    )
    .times(
      wrappedI80F48toBigNumber(maxInterestRate).minus(
        wrappedI80F48toBigNumber(plateauInterestRate)
      )
    )
    .plus(wrappedI80F48toBigNumber(plateauInterestRate));
}
