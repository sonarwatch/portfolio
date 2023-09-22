import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, TokenPrice, Yield, aprToApy, formatMoveTokenAddress, getElementLendingValues } from '@sonarwatch/portfolio-core';
import { SuiObjectDataFilter, getObjectFields, getObjectType, normalizeStructTag, parseStructTag } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketCoinPackageId, marketKey, platformId, spoolAccountPackageId, marketPrefix as prefix, poolsKey, poolsPrefix } from './constants';
import { getOwnerObject } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { MarketJobResult, Pools, UserLending } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const pools = await cache.getItem<Pools>(poolsKey, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui
  });
  if(!pools) return [];
  
  const poolValues = Object.values(pools);
  if(poolValues.length === 0) return [];
  
  const filterOwnerObject: SuiObjectDataFilter = {
    MatchAny: [
      ...poolValues.map((value) => ({
        StructType: `0x2::coin::Coin<${marketCoinPackageId}<${value.coinType}>>`
      })),
      {
        StructType: spoolAccountPackageId,
      }
    ]
  };

  const [allOwnedObjects, marketData] = await Promise.all([
    getOwnerObject(owner, { filter: filterOwnerObject }),
    cache.getItem<MarketJobResult>(marketKey, {
      prefix,
      networkId: NetworkId.sui
    })
  ])
  if (!marketData || allOwnedObjects.length === 0) return [];

  const lendingRate: Map<string, number> = new Map();

  Object.keys(pools).forEach((coinName: string) => {
    const market = marketData[coinName];
    if (!market) return;
    lendingRate.set(coinName, (
      Number(market.debt) +
      Number(market.cash) -
      Number(market.reserve)) /
      Number(market.marketCoinSupply)
    );
  });

  // get user lending assets
  const lendingAssets: { [key: string]:  UserLending } = {};
  for (const ownedMarketCoin of allOwnedObjects) {
    const objType = getObjectType(ownedMarketCoin);
    if (!objType) continue;
    
    const parsed = parseStructTag(objType);
    const coinType = normalizeStructTag(objType.substring(objType.indexOf('MarketCoin<') + 11, objType.indexOf('>')));
    const fields = getObjectFields(ownedMarketCoin);
    const coinName = poolValues.find((value) => value.coinType === coinType)?.metadata?.symbol.toLowerCase();
    
    if (!coinName || !fields) continue;
    if (!lendingAssets[coinName]) {
      lendingAssets[coinName] = { coinType, amount: new BigNumber(0) };
    }
    
    const balance = BigNumber((parsed.name === 'Coin' ? fields['balance'] : fields['stakes']) ?? 0);
    lendingAssets[coinName] = { ...lendingAssets[coinName], amount: lendingAssets[coinName].amount.plus(balance) };
  }

  const tokenAddresses = Object.values(lendingAssets).map((value) => value.coinType);
  const tokenPriceResult = await cache.getTokenPrices(tokenAddresses, NetworkId.sui);
  const tokenPrices: Map<string, TokenPrice> = new Map();

  tokenPriceResult.forEach((r) => {
    if (!r) return;
    tokenPrices.set(r.address, r);
  })

  for (const [assetName, assetValue] of Object.entries(lendingAssets)) {
    const market = marketData[assetName];
    if (!market) continue;
    
    const addressMove = formatMoveTokenAddress(assetValue.coinType);
    const tokenPrice = tokenPrices.get(addressMove);    
    const lendingAmount = assetValue.amount
      .multipliedBy(lendingRate.get(assetName) ?? 0)
      .dividedBy(10 ** (pools[assetName]?.metadata?.decimals ?? 0))
      .toNumber();
    
    const assetToken = tokenPriceToAssetToken(
      addressMove,
      lendingAmount,
      NetworkId.sui,
      tokenPrice
    );

    suppliedYields.push([
      {
        apy: aprToApy(market.supplyInterestRate),
        apr: market.supplyInterestRate
      }
    ]);
    suppliedAssets.push(assetToken);
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
