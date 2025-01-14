/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CoinBalance, SuiObjectDataFilter } from '@mysten/sui/client';
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
  marketKey,
  marketPrefix,
  platformId,
  poolAddressKey,
  poolAddressPrefix,
  sPoolAccountType,
  spoolsKey,
  spoolsPrefix,
} from './constants';
import {
  MarketJobResult,
  PoolAddressMap,
  SpoolAccountFieldsType,
  SpoolJobResult,
  StructTag,
  UserLendingData,
  UserStakeAccounts,
} from './types';
import { hasSCoinPredicate, hasSpoolPredicate } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const poolAddress = await cache.getItem<PoolAddressMap>(poolAddressKey, {
    prefix: poolAddressPrefix,
    networkId: NetworkId.sui,
  });

  if (!poolAddress) {
    return [];
  }

  const poolAddressValues = Object.values(poolAddress);
  if (poolAddressValues.length === 0) {
    return [];
  }

  const sCoinToCoinDataMap = poolAddressValues
    .filter(hasSCoinPredicate)
    .reduce((acc, { sCoinType, coinName, coinType }) => {
      acc[sCoinType] = { coinName, coinType };
      return acc;
    }, {} as Record<string, { coinType: string; coinName: string }>);

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
        prefix: marketPrefix,
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
    const coinName = poolAddress[stakeType]?.symbol.toLowerCase() as string;
    if (!coinName) return;

    // sui -> ssui, usdc -> susdc, ...
    const spoolName = `s${coinName}` as string;
    const { stakes, points, index } = fields;
    if (!stakedAccounts[spoolName]) {
      stakedAccounts[spoolName] = [];
    }
    stakedAccounts[spoolName].push({
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
    const coinData = sCoinToCoinDataMap[normalizedType];

    if (isMarketCoin) {
      // access underlying asset type from market coin struct
      // 0x2::coin::Coin<T>
      const underlyingStruct = typeParams[0] as StructTag;
      const coinType = `${underlyingStruct.address}::${underlyingStruct.module}::${underlyingStruct.name}`;
      const coinName = poolAddress[coinType]?.symbol.toLowerCase() as string;
      if (!coinName) return;

      lendingAssets[coinName] = {
        coinType,
        amount: BigNumber(obj.totalBalance),
      };
    } else if (coinData) {
      // Get the pair type and name of the scoin
      const { coinType, coinName } = coinData;

      lendingAssets[coinName] = {
        coinType,
        amount: BigNumber(obj.totalBalance),
      };
    }
  });

  let pendingReward = BigNumber(0);

  poolAddressValues
    .filter(hasSpoolPredicate)
    .forEach(({ spoolName: marketCoin }) => {
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

  Object.entries(lendingAssets)
    .filter(
      ([assetName, { amount }]) =>
        amount.isGreaterThan(0) && marketData[assetName]
    )
    .forEach(([assetName, { coinType, amount }]) => {
      const { supplyInterestRate, conversionRate } = marketData[assetName]!;
      const addressMove = formatMoveTokenAddress(coinType);
      const tokenPrice = tokenPrices.get(addressMove);
      const lendingAmount = amount
        // conversion rate from sCoin or market coin to its pair coin or underlying coin
        .multipliedBy(conversionRate ?? 1)
        .shiftedBy(-1 * (poolAddress[coinType]?.decimals ?? 0))
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
