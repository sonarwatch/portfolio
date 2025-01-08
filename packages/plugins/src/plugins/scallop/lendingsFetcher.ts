/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CoinBalance,
  CoinMetadata,
  SuiObjectDataFilter,
} from '@mysten/sui/client';
import { normalizeStructTag, parseStructTag } from '@mysten/sui/utils';
import {
  aprToApy,
  formatMoveTokenAddress,
  getElementLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  suiNetwork,
  Yield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSui } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';
import { ObjectResponse } from '../../utils/sui/types';
import {
  baseIndexRate,
  MARKET_COIN_NAMES,
  marketKey,
  platformId,
  poolsKey,
  poolsPrefix,
  marketPrefix as prefix,
  scoinKey,
  scoinPrefix,
  sPoolAccountType,
  spoolsKey,
  spoolsPrefix,
} from './constants';
import {
  MarketCoinName,
  MarketJobResult,
  PoolCoinName,
  Pools,
  SCoinName,
  sCoinToCoinName,
  SCoinTypeMetadata,
  // sCoinTypesMap,
  sCoinTypeToCoinTypeMap,
  SpoolAccountFieldsType,
  SpoolJobResult,
  StructTag,
  UserLending,
  UserLendingData,
  UserStakeAccounts,
} from './types';

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

  // {'0x...': CoinMetaData }
  const poolValuesMetadataMap = poolValues.reduce((acc, poolValue) => {
    if (poolValue.metadata) acc[poolValue.coinType] = poolValue.metadata;
    return acc;
  }, {} as { [k in string]: CoinMetadata });

  const client = getClientSui();
  const filterSpoolAccount: SuiObjectDataFilter = {
    MatchAny: [
      {
        StructType: sPoolAccountType,
      },
    ],
  };

  const [allBalances, spoolAccounts, marketData, spoolData] = await Promise.all(
    [
      client.getAllBalances({
        owner,
      }),
      getOwnedObjectsPreloaded<SpoolAccountFieldsType>(client, owner, {
        filter: filterSpoolAccount,
      }),
      cache.getItem<MarketJobResult>(marketKey, {
        prefix,
        networkId: NetworkId.sui,
      }),
      cache.getItem<SpoolJobResult>(spoolsKey, {
        prefix: spoolsPrefix,
        networkId: NetworkId.sui,
      }),
    ]
  );

  const fetchedDataIncomplete =
    !marketData ||
    !spoolData ||
    // spoolAccounts.length === 0 ||
    Object.keys(marketData).length === 0 ||
    Object.keys(spoolData).length === 0;
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

  spoolAccounts.forEach((obj: ObjectResponse<SpoolAccountFieldsType>) => {
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
    ]?.symbol.toLowerCase() as PoolCoinName;
    if (!coinName) return;

    // sui -> ssui, usdc -> susdc, ...
    const spoolName = `s${coinName}` as MarketCoinName;
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
  });

  allBalances.forEach((obj: CoinBalance) => {
    const normalizedType = normalizeStructTag(obj.coinType);
    const { address, module, name, typeParams } =
      parseStructTag(normalizedType);

    const isMarketCoin =
      address ===
        '0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf' &&
      module === 'reserve' &&
      name === 'MarketCoin';

    // Get the coin type pair if the coin is a sCoin
    const coinTypePair = sCoinTypeToCoinTypeMap[normalizedType];

    if (isMarketCoin) {
      // access underlying asset type from market coin struct
      // 0x2::coin::Coin<T>
      const underlyingStruct = typeParams[0] as StructTag;
      const coinType = `${underlyingStruct.address}::${underlyingStruct.module}::${underlyingStruct.name}`;
      const coinName = poolValuesMetadataMap[
        coinType
      ]?.symbol.toLowerCase() as PoolCoinName;
      if (!coinName) return;

      lendingAssets[coinName] = {
        coinType,
        amount: BigNumber(obj.totalBalance),
      };
    } else if (coinTypePair) {
      const coinNamePair = sCoinToCoinName[module as SCoinName];

      lendingAssets[coinNamePair] = {
        coinType: coinTypePair,
        amount: BigNumber(obj.totalBalance),
      };
    }
  });

  let pendingReward = BigNumber(0);

  MARKET_COIN_NAMES.forEach((marketCoin) => {
    if (!stakedAccounts[marketCoin]) return;

    stakedAccounts[marketCoin]!.forEach(({ points, index, stakes }) => {
      if (!spoolData[marketCoin]) return;
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
          -1 * (pools[assetName as PoolCoinName]?.metadata?.decimals ?? 0)
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
