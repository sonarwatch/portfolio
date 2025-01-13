import { SuiClient } from '@mysten/sui/client';
import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  BalanceSheet,
  BalanceSheetData,
  BorrowIndexData,
  BorrowIndexes,
  InterestModel,
  InterestModelData,
  MarketJobResult,
  PoolAddressMap,
  RiskModelData,
  RiskModels,
} from '../types';
import { queryMultipleObjects } from '../util';
import { marketKey, marketPrefix } from '../constants';
import { Cache } from '../../../Cache';

const queryMarkets = async (
  client: SuiClient,
  poolAddress: PoolAddressMap,
  cache: Cache
) => {
  const poolAddressValues = Object.values(poolAddress);
  const balanceSheetObjects = await queryMultipleObjects<BalanceSheetData>(
    client,
    poolAddressValues.map((t) => t.lendingPoolAddress)
  );

  // get balance sheet
  const balanceSheets: BalanceSheet = poolAddressValues.reduce(
    (acc, { coinName }, idx) => {
      const balanceSheetObject = balanceSheetObjects[idx];
      if (!balanceSheetObject) return acc;
      if (
        balanceSheetObject.data?.content &&
        balanceSheetObject.data?.content.dataType === 'moveObject'
      ) {
        acc[coinName] = balanceSheetObject.data.content.fields;
      }
      return acc;
    },
    {} as Record<string, BalanceSheetData>
  );

  // get borrow indexes
  const borrowIndexObjects = await queryMultipleObjects<BorrowIndexData>(
    client,
    poolAddressValues.map((t) => t.borrowDynamic)
  );
  const borrowIndexes: BorrowIndexes = poolAddressValues.reduce(
    (acc, { coinName }, idx) => {
      const borrowIndexObject = borrowIndexObjects[idx];
      if (!borrowIndexObject) return acc;
      if (
        borrowIndexObject.data?.content &&
        borrowIndexObject.data?.content.dataType === 'moveObject'
      ) {
        acc[coinName] = borrowIndexObject.data?.content.fields;
      }
      return acc;
    },
    {} as Record<string, BorrowIndexData>
  );

  // get risk models
  const riskModelCoinNameToObjectId = poolAddressValues.reduce(
    (acc, { coinName, riskModel }) => {
      if (!riskModel) return acc;
      acc[coinName] = riskModel;
      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as Record<string, string>
  );
  const riskModelObjects = await queryMultipleObjects<RiskModelData>(
    client,
    Object.values(riskModelCoinNameToObjectId)
  );
  const riskModels: RiskModels = Object.keys(
    riskModelCoinNameToObjectId
  ).reduce((acc, coinName, idx) => {
    const riskModelObject = riskModelObjects[idx];
    if (!riskModelObject) return acc;
    if (
      riskModelObject.data?.content &&
      riskModelObject.data?.content.dataType === 'moveObject'
    ) {
      acc[coinName] = riskModelObject.data?.content.fields;
    }
    return acc;
  }, {} as Record<string, RiskModelData>);

  // get interest models
  const interestModelObjects = await queryMultipleObjects(
    client,
    poolAddressValues.map((t) => t.interestModel)
  );
  const interestModels: InterestModel = poolAddressValues.reduce(
    (acc, { coinName }, idx) => {
      const interestModelObject = interestModelObjects[idx];
      if (!interestModelObject) return acc;
      if (
        interestModelObject.data?.content &&
        interestModelObject.data?.content.dataType === 'moveObject'
      ) {
        acc[coinName] = interestModelObject.data?.content.fields;
      }
      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as Record<string, any>
  );

  const market: MarketJobResult = {};
  const borrowYearFactor = 24 * 365 * 3600;
  const DENOMINATOR = 2 ** 32;
  for (const data of poolAddressValues) {
    const { coinName: asset, decimals, coinType } = data;
    const interestModelData = interestModels[asset];
    const borrowIndexData = borrowIndexes[asset];
    const balanceSheetData = balanceSheets[asset];
    const riskModelData = riskModels[asset]; // no risk model = asset cannot be collateralized
    if (!interestModelData || !borrowIndexData || !balanceSheetData) continue;

    const cInterestModel = interestModelData['value']
      .fields as InterestModelData;
    const cBorrowIndex = borrowIndexData['value'].fields as BorrowIndexData;
    const cBalanceSheet = balanceSheetData['value'].fields as BalanceSheetData;
    const cRiskModelData = (
      riskModelData
        ? riskModelData['value'].fields
        : {
            collateral_factor: {
              fields: {
                value: '0',
              },
            },
          }
    ) as RiskModelData;

    const borrowRate =
      Number(cBorrowIndex.interest_rate.fields.value) / DENOMINATOR;
    const borrowRateScale = Number(cBorrowIndex.interest_rate_scale);
    const borrowIndex = Number(cBorrowIndex.borrow_index);
    const maxBorrowRate =
      Number(cInterestModel.max_borrow_rate.fields.value) / DENOMINATOR;
    const lastUpdated = Number(cBorrowIndex.last_updated);
    const cash = Number(cBalanceSheet.cash);
    const debt = Number(cBalanceSheet.debt);
    const reserve = Number(cBalanceSheet.revenue);
    const reserveFactor =
      Number(cInterestModel.revenue_factor.fields.value) / DENOMINATOR;
    const borrowWeight =
      Number(cInterestModel.borrow_weight.fields.value) / DENOMINATOR;
    const collateralFactor =
      Number(cRiskModelData.collateral_factor.fields.value) / DENOMINATOR;
    const marketCoinSupply = Number(cBalanceSheet.market_coin_supply);

    // calculated  data
    const calculatedBorrowRate =
      (borrowRate * borrowYearFactor) / borrowRateScale;
    const timeDelta = Math.floor(Date.now() / 1000) - lastUpdated;
    const borrowIndexDelta = BigNumber(borrowIndex)
      .multipliedBy(BigNumber(timeDelta).multipliedBy(borrowRate))
      .dividedBy(borrowRateScale);
    const currentBorrowIndex = BigNumber(borrowIndex).plus(borrowIndexDelta);
    // how much accumulated interest since `lastUpdate`
    const growthInterest = BigNumber(currentBorrowIndex)
      .dividedBy(borrowIndex)
      .minus(1);
    const increasedDebt = BigNumber(debt).multipliedBy(growthInterest);
    const currentTotalDebt = increasedDebt.plus(debt);
    const currentTotalReserve = BigNumber(reserve).plus(
      increasedDebt.multipliedBy(reserveFactor)
    );
    const calculatedMaxBorrowRate =
      (maxBorrowRate * borrowYearFactor) / borrowRateScale;
    const currentTotalSupply = BigNumber(currentTotalDebt).plus(
      Math.max(cash - currentTotalReserve.toNumber(), 0)
    );
    let utilizationRate =
      BigNumber(currentTotalDebt).dividedBy(currentTotalSupply);
    utilizationRate = utilizationRate.isFinite()
      ? utilizationRate
      : BigNumber(0);
    let supplyRate = BigNumber(calculatedBorrowRate)
      .multipliedBy(utilizationRate)
      .multipliedBy(1 - reserveFactor);
    supplyRate = supplyRate.isFinite() ? supplyRate : BigNumber(0);
    let conversionRate = currentTotalSupply.dividedBy(marketCoinSupply || 1);
    conversionRate =
      conversionRate.isFinite() && !conversionRate.isNaN()
        ? conversionRate
        : BigNumber(1);

    market[asset] = {
      coin: asset,
      decimals,
      coinType,
      // growthInterest: growthInterest.toNumber(),
      borrowInterestRate: Math.min(
        calculatedBorrowRate,
        calculatedMaxBorrowRate
      ),
      supplyInterestRate: supplyRate.toNumber(),
      debt,
      cash,
      marketCoinSupply,
      reserve,
      borrowIndex,
      borrowWeight,
      collateralFactor,
      conversionRate: conversionRate.toNumber(),
    };
  }

  await cache.setItem(marketKey, market, {
    prefix: marketPrefix,
    networkId: NetworkId.sui,
  });
};

export default queryMarkets;
