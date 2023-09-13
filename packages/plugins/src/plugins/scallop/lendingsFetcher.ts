import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, TokenPrice, Yield, aprToApy, formatMoveTokenAddress, getElementLendingValues } from '@sonarwatch/portfolio-core';
import { SuiObjectDataFilter, parseStructTag, } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketCoinPackageId, marketKey, obligationKeyPackageId, platformId, spoolAccountPackageId, marketPrefix as prefix } from './constants';
import { getCoinTypeMetadata, getOwnerObject } from './helpers';
import { getLending } from './getLending';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { MarketJobResult, BalanceSheetData, BorrowIndexData, InterestModelData } from './types';
import runInBatch from '../../utils/misc/runInBatch';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const coinTypeMetadata = await getCoinTypeMetadata(cache);
  const coinName = Object.keys(coinTypeMetadata);
  const filterOwnerObject: SuiObjectDataFilter = {
    MatchAny: [
      ...Object.values(coinTypeMetadata).map((value) => ({
        StructType: `0x2::coin::Coin<${marketCoinPackageId}<${value.coinType}>>`
      })),
      {
        StructType: obligationKeyPackageId,
      },
      {
        StructType: spoolAccountPackageId,
      }
    ]
  }

  const [allOwnedObjects, marketData] = await Promise.all([
    getOwnerObject(owner, { filter: filterOwnerObject }),
    cache.getItem<MarketJobResult>(marketKey, {
      prefix,
      networkId: NetworkId.sui
    })
  ])
  if (!marketData || allOwnedObjects.length === 0) return [];

  const lendingRate: { [key: string]: number } = {};

  coinName.forEach((name: string) => {
    const balanceSheet = marketData.balanceSheets[name];
    if (balanceSheet) {
      const cBalanceSheet = balanceSheet['value'].fields as BalanceSheetData;
      lendingRate[name] =
        (Number(cBalanceSheet.debt) +
          Number(cBalanceSheet.cash) -
          Number(cBalanceSheet.revenue)) /
        Number(cBalanceSheet.market_coin_supply);
    }
  });
  const ownedMarketAndSpoolAccount = [];
  for (const ownedObject of allOwnedObjects) {
    const parsed = ownedObject.type ? parseStructTag(ownedObject.type) : ''
    if (parsed && (parsed.name === 'Coin' || parsed.name === 'SpoolAccount')) {
      ownedMarketAndSpoolAccount.push(ownedObject);
    }
  }
  const { interestModels, borrowIndexes, balanceSheets } = marketData

  const lending = getLending(ownedMarketAndSpoolAccount, lendingRate, coinTypeMetadata);
  const tokenAddresses = Object.values(lending).map((value) => formatMoveTokenAddress(value.coinType))
  const tokenPriceResult = await await runInBatch([...tokenAddresses].map(
    (address) => () => cache.getTokenPrice(address, NetworkId.sui)
  ))
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResult.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  })
  const borrowYearFactor = 24 * 365 * 3600;
  for (const asset of Object.keys(lending)) {
    const lendingAsset = lending[asset]
    const interestModelData = interestModels[asset]
    const borrowIndexData = borrowIndexes[asset];
    const balanceSheetData = balanceSheets[asset];
    if (!interestModelData || !borrowIndexData || !balanceSheetData) continue;
    const cInterestModel = interestModelData['value'].fields as InterestModelData;
    const cBorrowIndex = borrowIndexData['value'].fields as BorrowIndexData;
    const cBalanceSheet = balanceSheetData['value'].fields as BalanceSheetData;

    const borrowRate = Number(cBorrowIndex.interest_rate.fields.value) / 2 ** 32;
    const borrowRateScale = Number(cBorrowIndex.interest_rate_scale);
    const borrowIndex = Number(cBorrowIndex.borrow_index);
    const lastUpdated = Number(cBorrowIndex.last_updated);
    const cash = Number(cBalanceSheet.cash);
    const debt = Number(cBalanceSheet.debt);
    const reserve = Number(cBalanceSheet.revenue);
    const reserveFactor = Number(cInterestModel.revenue_factor.fields.value) / 2 ** 32;

    // calculated  data
    const calculatedBorrowRate = (borrowRate * borrowYearFactor) / borrowRateScale
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

    const addressMove = formatMoveTokenAddress(lendingAsset.coinType);
    const tokenPrice = tokenPrices.get(addressMove);
    suppliedYields.push([
      {
        apy: aprToApy(supplyRate.toNumber()),
        apr: supplyRate.toNumber()
      }
    ]);
    const assetToken = tokenPriceToAssetToken(
      addressMove,
      lendingAsset.amount,
      NetworkId.sui,
      tokenPrice
    )
    suppliedAssets.push(assetToken)
  }
  const { borrowedValue, collateralRatio, suppliedValue, value } =
    getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);
  elements.push({
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.sui,
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
      collateralRatio,
      rewardAssets,
      value,
    }
  })
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-lendings`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
