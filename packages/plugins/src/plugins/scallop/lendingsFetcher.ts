/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  aprToApy,
  formatMoveTokenAddress,
  getElementLendingValues,
  suiNetwork,
} from '@sonarwatch/portfolio-core';
import { normalizeStructTag, parseStructTag } from '@mysten/sui/utils';
import BigNumber from 'bignumber.js';
import {
  CoinMetadata,
  CoinStruct,
  SuiObjectDataFilter,
} from '@mysten/sui/client';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  marketCoinType,
  marketKey,
  platformId,
  marketPrefix as prefix,
  poolsKey,
  poolsPrefix,
  spoolsKey,
  spoolsPrefix,
  baseIndexRate,
  scoinKey,
  scoinPrefix,
  addressKey,
  addressPrefix,
  sPoolAccountType,
  marketCoinNames,
} from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import {
  AddressInfo,
  MarketCoinNames,
  MarketJobResult,
  PoolCoinNames,
  Pools,
  SCoinNames,
  sCoinToCoinName,
  SCoinTypeMetadata,
  sCoinTypeToCoinTypeMap,
  SCoinTypeValue,
  SpoolAccountFieldsType,
  SpoolJobResult,
  StructTag,
  UserLending,
  UserLendingData,
  UserStakeAccounts,
} from './types';
import { getClientSui } from '../../utils/clients';
import { ObjectResponse } from '../../utils/sui/types';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const pools = await cache.getItem<Pools>(poolsKey, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui,
  });

  const sCoins = await cache.getItem<SCoinTypeMetadata>(scoinKey, {
    prefix: scoinPrefix,
    networkId: NetworkId.sui,
  });
  if (!pools || !sCoins) {
    return [];
  }

  const poolValues = Object.values(pools);
  if (poolValues.length === 0) {
    return [];
  }

  const sCoinValues = Object.values(sCoins);

  // {'0x...': CoinMetaData }
  const poolValuesMetadataMap = poolValues.reduce((acc, poolValue) => {
    if (poolValue.metadata) acc[poolValue.coinType] = poolValue.metadata;
    return acc;
  }, {} as { [k in string]: CoinMetadata });

  const client = getClientSui();
  const filterOwnerObject: SuiObjectDataFilter = {
    MatchAny: [
      ...poolValues.map((value) => ({
        StructType: `0x2::coin::Coin<${marketCoinType}<${value.coinType}>>`,
      })),
      ...sCoinValues.map(({ coinType }) => ({
        StructType: `0x2::coin::Coin<${coinType}>`,
      })),
      {
        StructType: sPoolAccountType,
      },
    ],
  };

  const [allOwnedObjects, marketData, spoolData, addressData] =
    await Promise.all([
      getOwnedObjectsPreloaded(client, owner, { filter: filterOwnerObject }),
      cache.getItem<MarketJobResult>(marketKey, {
        prefix,
        networkId: NetworkId.sui,
      }),
      cache.getItem<SpoolJobResult>(spoolsKey, {
        prefix: spoolsPrefix,
        networkId: NetworkId.sui,
      }),
      cache.getItem<AddressInfo>(addressKey, {
        prefix: addressPrefix,
        networkId: NetworkId.sui,
      }),
    ]);

  const fetchedDataIncomplete =
    !marketData ||
    !spoolData ||
    !addressData ||
    allOwnedObjects.length === 0 ||
    Object.keys(marketData).length === 0 ||
    Object.keys(spoolData).length === 0 ||
    Object.keys(addressData).length === 0;
  if (fetchedDataIncomplete) {
    return [];
  }

  const lendingRate: Map<string, number> = new Map();

  Object.keys(pools).forEach((coinName: string) => {
    const market = marketData[coinName];
    if (!market) {
      return;
    }
    lendingRate.set(
      coinName,
      (Number(market.debt) + Number(market.cash) - Number(market.reserve)) /
        Number(market.marketCoinSupply)
    );
  });

  // get user lending assets
  const lendingAssets: UserLendingData = {};
  const stakedAccounts: UserStakeAccounts = {};

  const isSpoolAccount = (
    obj: ObjectResponse<any>
  ): obj is ObjectResponse<SpoolAccountFieldsType> => {
    const objType = obj.data?.type;
    if (!objType) return false;

    const { address, module, name } = parseStructTag(
      normalizeStructTag(objType)
    );

    return `${address}::${module}::${name}` === sPoolAccountType;
  };

  const isSCoin = (
    obj: ObjectResponse<any>
  ): obj is ObjectResponse<CoinStruct> => {
    const objType = obj.data?.type;
    if (!objType) return false;

    const parsed = parseStructTag(objType);
    const isCoin = parsed.name === 'Coin';
    const sCoinTypeParsed = parsed.typeParams[0] as StructTag;
    const isObjectSCoin =
      !!sCoinToCoinName[sCoinTypeParsed.name.toLowerCase() as SCoinNames];

    return isCoin && isObjectSCoin;
  };

  const isMarketCoin = (
    obj: ObjectResponse<any>
  ): obj is ObjectResponse<CoinStruct> => {
    const objType = obj.data?.type;
    if (!objType) return false;

    const { address, module, name } = parseStructTag(objType);
    const isCoin = name === 'Coin';
    const isObjectMarketCoin =
      address === addressData.mainnet.core.object &&
      module === 'reserve' &&
      name === 'MarketCoin';
    return isCoin && isObjectMarketCoin;
  };

  allOwnedObjects.forEach((obj: ObjectResponse<any>) => {
    if (isMarketCoin(obj)) {
      const marketCoinObj = obj.data;
      if (!marketCoinObj) return;

      // access underlying asset type from market coin struct
      // 0x2::coin::Coin<T>
      const { address, module, name } = parseStructTag(
        normalizeStructTag(marketCoinObj.type)
      ).typeParams[0] as StructTag;
      const coinType = `${address}::${module}::${name}`;
      const coinName = poolValuesMetadataMap[
        coinType
      ]?.symbol.toLowerCase() as PoolCoinNames;
      if (!coinName) return;

      const coinBalance = BigNumber(marketCoinObj.content?.fields.balance ?? 0);
      if (!coinName) return;

      if (lendingAssets[coinName]) {
        lendingAssets[coinName]!.amount =
          lendingAssets[coinName]!.amount.plus(coinBalance);
      } else {
        lendingAssets[coinName] = { coinType, amount: coinBalance };
      }
    } else if (isSpoolAccount(obj)) {
      const spoolObj = obj.data;
      const fields = spoolObj?.content?.fields;
      if (!fields) return;

      // parse market coin struct inside the spoolAccount struct
      // 0x...::spool_account::SpoolAccount<0x..::reserve::MarketCoin<T>>
      const marketCoinStruct = parseStructTag(normalizeStructTag(spoolObj.type))
        .typeParams[0] as StructTag;
      const { address, module, name } = marketCoinStruct
        .typeParams[0] as StructTag;
      const stakeType = `${address}::${module}::${name}`;
      const coinName = poolValuesMetadataMap[
        stakeType
      ]?.symbol.toLowerCase() as PoolCoinNames;
      if (!coinName) return;

      // sui -> ssui, usdc -> susdc, ...
      const spoolName = `s${coinName}` as MarketCoinNames;
      const { stakes, points, index } = fields;
      if (!stakedAccounts[spoolName]) {
        stakedAccounts[spoolName] = [];
      }
      stakedAccounts[spoolName]!.push({
        stakes,
        points,
        index,
      });

      const stakeBalance = BigNumber(stakes);
      if (lendingAssets[coinName]) {
        lendingAssets[coinName]!.amount =
          lendingAssets[coinName]!.amount.plus(stakeBalance);
      } else {
        lendingAssets[coinName] = { coinType: stakeType, amount: stakeBalance };
      }
    } else if (isSCoin(obj)) {
      const marketCoinObj = obj.data;
      if (!marketCoinObj) return;

      // access underlying asset type from market coin struct
      // 0x2::coin::Coin<T>
      const { address, module, name } = parseStructTag(
        normalizeStructTag(marketCoinObj.type)
      ).typeParams[0] as StructTag;

      // convert sCoinType to coinType
      const sCoinType = `${address}::${module}::${name}`;
      const coinType = sCoinTypeToCoinTypeMap[sCoinType as SCoinTypeValue];
      if (!coinType) return;

      const coinName = poolValuesMetadataMap[
        coinType
      ]?.symbol.toLowerCase() as PoolCoinNames;
      if (!coinName) return;

      const coinBalance = BigNumber(marketCoinObj.content?.fields.balance ?? 0);

      if (lendingAssets[coinName]) {
        lendingAssets[coinName]!.amount =
          lendingAssets[coinName]!.amount.plus(coinBalance);
      } else {
        lendingAssets[coinName] = { coinType, amount: coinBalance };
      }
    }
  });

  let pendingReward = BigNumber(0);

  marketCoinNames.forEach((marketCoin) => {
    if (!stakedAccounts[marketCoin]) return;

    stakedAccounts[marketCoin]!.forEach(({ points, index, stakes }) => {
      if (spoolData[marketCoin]) {
        const {
          currentPointIndex,
          exchangeRateNumerator,
          exchangeRateDenominator,
        } = spoolData[marketCoin];
        const increasedPointRate = currentPointIndex
          ? BigNumber(BigNumber(currentPointIndex).minus(index)).dividedBy(
              baseIndexRate
            )
          : 0;
        pendingReward = pendingReward.plus(
          BigNumber(stakes)
            .multipliedBy(increasedPointRate)
            .plus(points)
            .multipliedBy(exchangeRateNumerator)
            .dividedBy(exchangeRateDenominator)
        );
      }
    });
  });

  const tokenAddresses = Object.values(lendingAssets).map(
    (value) => value.coinType
  );
  const tokenPrices = await cache.getTokenPricesAsMap(
    [...tokenAddresses, suiNetwork.native.address],
    NetworkId.sui
  );

  if (pendingReward.isGreaterThan(0)) {
    const pendingRewardAmount = pendingReward
      .shiftedBy(-1 * suiNetwork.native.decimals)
      .toNumber();
    const rewardTokenAddress = formatMoveTokenAddress(
      suiNetwork.native.address
    );
    const rewardTokenPrice = tokenPrices.get(rewardTokenAddress);
    const rewardAssetToken = tokenPriceToAssetToken(
      rewardTokenAddress,
      pendingRewardAmount,
      NetworkId.sui,
      rewardTokenPrice,
      undefined,
      {
        isClaimable: true,
      }
    );
    rewardAssets.push({ ...rewardAssetToken });
  }

  Object.entries<UserLending>(lendingAssets)
    .filter(
      ([assetName, assetValue]) =>
        assetValue.amount.isGreaterThan(0) && marketData[assetName]
    )
    .forEach(([assetName, assetValue]) => {
      const { supplyInterestRate } = marketData[assetName]!;
      const addressMove = formatMoveTokenAddress(assetValue.coinType);
      const tokenPrice = tokenPrices.get(addressMove);
      const lendingAmount = assetValue.amount
        .multipliedBy(lendingRate.get(assetName) ?? 0)
        .shiftedBy(
          -1 * (pools[assetName as PoolCoinNames]?.metadata?.decimals ?? 0)
        )
        .toNumber();
      const assetToken = tokenPriceToAssetToken(
        addressMove,
        lendingAmount,
        NetworkId.sui,
        tokenPrice
      );

      suppliedYields.push([
        {
          apy: aprToApy(supplyInterestRate),
          apr: supplyInterestRate,
        },
      ]);
      suppliedAssets.push(assetToken);
    });
  if (
    suppliedAssets.length === 0 &&
    borrowedAssets.length === 0 &&
    rewardAssets.length === 0
  ) {
    return [];
  }
  const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
    getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });
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
      healthRatio,
      rewardAssets,
      rewardValue,
      value,
    },
  });
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-lendings`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
