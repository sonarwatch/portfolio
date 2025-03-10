import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { Bank } from './structs/Bank';
import { MarginfiAccount } from './structs/MarginfiAccount';
import { BankInfo } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { platformId } from './constants';
import { ParsedAccount } from '../../utils/solana';

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

export function getElementFromAccount(
  marginfiAccount: ParsedAccount<MarginfiAccount>,
  banksInfoByAddress: Map<string, BankInfo>,
  tokenPriceById: Map<string, TokenPrice>
): PortfolioElement | null {
  const { balances } = marginfiAccount.lendingAccount;
  if (!balances || balances.length === 0) return null;

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];
  const suppliedLtvs: number[] = [];
  const borrowedWeights: number[] = [];

  let name;
  for (let index = 0; index < balances.length; index += 1) {
    const balance = balances[index];
    if (balance.bankPk.toString() === '11111111111111111111111111111111')
      continue;
    const bankInfo = banksInfoByAddress.get(balance.bankPk.toString());
    if (!bankInfo) continue;

    const tokenPrice = tokenPriceById.get(bankInfo.mint.toString());
    if (!balance.assetShares.value.isZero()) {
      suppliedLtvs.push(bankInfo.suppliedLtv);
      const suppliedAmount = wrappedI80F48toBigNumber(balance.assetShares)
        .times(bankInfo.dividedAssetShareValue)
        .toNumber();

      // If one of the deposited asset is a stake collateral, show it inside the element name
      if (tokenPrice?.elementName === 'Stake Collateral')
        name = 'Stake Collateral';

      suppliedAssets.push({
        ...tokenPriceToAssetToken(
          bankInfo.mint.toString(),
          suppliedAmount,
          NetworkId.solana,
          tokenPrice
        ),
        sourceRefs: [
          { name: 'Lending Market', address: balance.bankPk.toString() },
        ],
      });
      suppliedYields.push(bankInfo.suppliedYields);
    }

    if (!balance.liabilityShares.value.isZero()) {
      borrowedWeights.push(bankInfo.borrowedWeight);
      const borrowedAmount = wrappedI80F48toBigNumber(balance.liabilityShares)
        .times(bankInfo.dividedLiabilityShareValue)
        .toNumber();

      borrowedAssets.push({
        ...tokenPriceToAssetToken(
          bankInfo.mint.toString(),
          borrowedAmount,
          NetworkId.solana,
          tokenPrice
        ),
        sourceRefs: [
          { name: 'Lending Market', address: balance.bankPk.toString() },
        ],
      });
      borrowedYields.push(bankInfo.borrowedYields);
    }
  }

  if (suppliedAssets.length === 0 && borrowedAssets.length === 0) return null;

  const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
    getElementLendingValues({
      suppliedAssets,
      borrowedAssets,
      rewardAssets,
      suppliedLtvs,
      borrowedWeights,
    });

  return {
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.solana,
    platformId,
    label: 'Lending',
    value,
    data: {
      borrowedAssets,
      borrowedValue,
      borrowedYields,
      suppliedAssets,
      suppliedValue,
      suppliedYields,
      healthRatio,
      rewardAssets,
      rewardValue,
      value,
      ref: marginfiAccount.pubkey.toString(),
      link: 'https://app.marginfi.com/portfolio',
    },
    name,
  };
}
