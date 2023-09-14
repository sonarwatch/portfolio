import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, TokenPrice, Yield, aprToApy, formatMoveTokenAddress, getElementLendingValues } from '@sonarwatch/portfolio-core';
import { SuiObjectDataFilter } from '@mysten/sui.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketCoinPackageId, marketKey, platformId, spoolAccountPackageId, marketPrefix as prefix } from './constants';
import { getCoinTypeMetadata, getOwnerObject } from './helpers';
import { getLending } from './getLending';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { MarketJobResult } from './types';
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
    const market = marketData[name];
    if(!market) return;
    lendingRate[name] =
        (Number(market.debt) +
          Number(market.cash) -
          Number(market.reserve)) /
        Number(market.marketCoinSupply);
  });
  
  const lending = getLending(allOwnedObjects, lendingRate, coinTypeMetadata);
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
  for (const asset of Object.keys(lending)) {
    const lendingAsset = lending[asset];
    const market = marketData[asset];
    if(!market) continue;
    const addressMove = formatMoveTokenAddress(lendingAsset.coinType);
    const tokenPrice = tokenPrices.get(addressMove);
    suppliedYields.push([
      {
        apy: aprToApy(market.supplyInterestRate),
        apr: market.supplyInterestRate
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
    name: 'Scallop Lending',
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
