import { NetworkId } from '@sonarwatch/portfolio-core';
import { getObjectFields } from "@mysten/sui.js";
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  marketKey,
  addressPrefix,
  marketPrefix as prefix,
  addressKey,
  poolsKey,
  poolsPrefix
} from './constants';
import { AddressInfo, Core } from "./types";
import type {
  BalanceSheet,
  BalanceSheetData,
  BorrowIndexData,
  BorrowIndexes, InterestModel,
  InterestModelData,
  MarketData,
  MarketJobResult,
  Pools
} from "./types";
import runInBatch from "../../utils/misc/runInBatch";

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const addressData = await cache.getItem<AddressInfo>(addressKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui,
  });
  if (!addressData) return;

  // ['cetus', 'apt', ...]
  const pools = await cache.getItem<Pools>(poolsKey, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui
  });
  if(!pools) return;

  const marketId: string = (addressData.mainnet.core as Core).market;

  // get market data
  const marketObject = await client.getObject({
    id: marketId,
    options: {
      showContent: true
    }
  });
  const marketData = getObjectFields(marketObject) as MarketData;

  // get balance sheet
  const balanceSheets: BalanceSheet = {};
  const balanceSheetParentId = marketData.vault.fields.balance_sheets.fields
    .table.fields.id.id;
  const balanceSheetPromises = Object.keys(pools).map((coinName) => async () => {
    balanceSheets[coinName] = getObjectFields(await client.getDynamicFieldObject({
      parentId: balanceSheetParentId,
      name: {
        type: '0x1::type_name::TypeName',
        value: {
          name: pools[coinName].coinType.substring(2)
        }
      }
    }));
  });

  await runInBatch(balanceSheetPromises, 5);

  // get borrow indexes
  const borrowIndexes: BorrowIndexes = {};
  const borrowIndexesParentId = marketData.borrow_dynamics.fields.table.fields.id.id;
  const borrowIndexesPromises = Object.keys(pools).map((coinName) => async () => {
    borrowIndexes[coinName] = getObjectFields(await client.getDynamicFieldObject({
      parentId: borrowIndexesParentId,
      name: {
        type: '0x1::type_name::TypeName',
        value: {
          name: pools[coinName].coinType.substring(2)
        }
      }
    }));
  });

  await runInBatch(borrowIndexesPromises, 5);

  // get interest models
  const interestModels: InterestModel = {};
  const interestModelsParentId = marketData.interest_models.fields.table.fields.id.id;
  for (const coinName of Object.keys(pools)) {
    interestModels[coinName] = getObjectFields(await client.getDynamicFieldObject({
      parentId: interestModelsParentId,
      name: {
        type: '0x1::type_name::TypeName',
        value: {
          name: pools[coinName].coinType.substring(2)
        }
      }
    }));
  }

  const market: MarketJobResult = {};
  const borrowYearFactor = 24 * 365 * 3600;
  for (const asset of Object.keys(pools)) {
    const interestModelData = interestModels[asset];
    const borrowIndexData = borrowIndexes[asset];
    const balanceSheetData = balanceSheets[asset];
    if (!interestModelData || !borrowIndexData || !balanceSheetData) continue;

    const cInterestModel = interestModelData['value'].fields as InterestModelData;
    const cBorrowIndex = borrowIndexData['value'].fields as BorrowIndexData;
    const cBalanceSheet = balanceSheetData['value'].fields as BalanceSheetData;

    const borrowRate = Number(cBorrowIndex.interest_rate.fields.value) / 2 ** 32;
    const borrowRateScale = Number(cBorrowIndex.interest_rate_scale);
    const borrowIndex = Number(cBorrowIndex.borrow_index);
    const maxBorrowRate = Number(cInterestModel.max_borrow_rate.fields.value) / 2 ** 32;
    const lastUpdated = Number(cBorrowIndex.last_updated);
    const cash = Number(cBalanceSheet.cash);
    const debt = Number(cBalanceSheet.debt);
    const reserve = Number(cBalanceSheet.revenue);
    const reserveFactor = Number(cInterestModel.revenue_factor.fields.value) / 2 ** 32;
    const marketCoinSupply = Number(cBalanceSheet.market_coin_supply);
    // calculated  data
    const calculatedBorrowRate = (borrowRate * borrowYearFactor) / borrowRateScale;
    const timeDelta = Math.floor(new Date().getTime() / 1000) - lastUpdated;
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
    const calculatedMaxBorrowRate = (maxBorrowRate * borrowYearFactor) / borrowRateScale;
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

    market[asset] = {
      coin: asset,
      decimal: pools[asset].metadata?.decimals ?? 0,
      coinType: pools[asset].coinType,
      growthInterest: growthInterest.toNumber(),
      borrowInterestRate: Math.min(
        calculatedBorrowRate,
        calculatedMaxBorrowRate
      ),
      supplyInterestRate: supplyRate.toNumber(),
      debt,
      cash,
      marketCoinSupply,
      reserve,
    };
  }

  await cache.setItem(
    marketKey,
    market,
    {
      prefix,
      networkId: NetworkId.sui
    }
  );
};

const job: Job = {
  id: prefix,
  executor,
};

export default job;
