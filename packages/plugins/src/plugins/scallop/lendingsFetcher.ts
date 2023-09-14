import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, TokenPrice, Yield, aprToApy, formatMoveTokenAddress, getElementLendingValues } from '@sonarwatch/portfolio-core';
import { SuiObjectDataFilter } from '@mysten/sui.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketCoinPackageId, marketKey, platformId, spoolAccountPackageId, marketPrefix as prefix } from './constants';
import { getCoinTypeMetadata, getOwnerObject } from './helpers';
import { getLending } from './getLending';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { MarketJobResult } from './types';

const executor: FetcherExecutor = async (ownerAddress: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const coinTypeMetadatas = await getCoinTypeMetadata(cache);
  const coinNames = Object.keys(coinTypeMetadatas);
  const filterOwnerObject: SuiObjectDataFilter = {
    MatchAny: [
      ...Object.values(coinTypeMetadatas).map((value) => ({
        StructType: `0x2::coin::Coin<${marketCoinPackageId}<${value.coinType}>>`
      })),
      {
        StructType: spoolAccountPackageId,
      }
    ]
  }

  const [allOwnedObjects, marketData] = await Promise.all([
    getOwnerObject(ownerAddress, { filter: filterOwnerObject }),
    cache.getItem<MarketJobResult>(marketKey, {
      prefix,
      networkId: NetworkId.sui
    })
  ])
  if (!marketData || allOwnedObjects.length === 0) return [];

  const lendingRate: { [key: string]: number } = {};

  coinNames.forEach((coinName: string) => {
    const market = marketData[coinName];
    if(!market) return;
    lendingRate[coinName] =
        (Number(market.debt) +
          Number(market.cash) -
          Number(market.reserve)) /
        Number(market.marketCoinSupply);
  });
  
  const lending = getLending(allOwnedObjects, lendingRate, coinTypeMetadatas);

  const tokenAddresses = Object.values(lending).map((value) => value.coinType);
  const tokenPriceResult = await cache.getTokenPrices(tokenAddresses, NetworkId.sui);
  const tokenPrices: Map<string, TokenPrice> = new Map();
  
  tokenPriceResult.forEach((r) => {
    if(!r) return;
    tokenPrices.set(r.address, r);
  })

  for (const assetName of Object.keys(lending)) {
    const lendingAsset = lending[assetName];
    const market = marketData[assetName];
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
