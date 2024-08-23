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
import { normalizeStructTag, parseStructTag } from '@mysten/sui.js/utils';
import BigNumber from 'bignumber.js';
import { SuiObjectDataFilter } from '@mysten/sui.js/client';
import { StructTag } from '@mysten/sui.js/bcs';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  marketCoinPackageId,
  marketKey,
  platformId,
  spoolAccountPackageId,
  marketPrefix as prefix,
  poolsKey,
  poolsPrefix,
  spoolsKey,
  spoolsPrefix,
  baseIndexRate,
  scoinKey,
  scoinPrefix,
  sCoinToCoinName,
  sCoinNames,
  sCoinTypeToCoinTypeMap,
  sCoinTypeValue,
} from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import {
  MarketJobResult,
  Pools,
  SCoinTypeMetadata,
  SpoolJobResult,
  UserLending,
  UserStakeAccounts,
} from './types';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { getClientSui } from '../../utils/clients';

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
  const sCoinValues = Object.values(sCoins);
  if (poolValues.length === 0) {
    return [];
  }

  const client = getClientSui();
  const filterOwnerObject: SuiObjectDataFilter = {
    MatchAny: [
      ...poolValues.map((value) => ({
        StructType: `0x2::coin::Coin<${marketCoinPackageId}<${value.coinType}>>`,
      })),
      ...sCoinValues.map(({ coinType }) => ({
        StructType: `0x2::coin::Coin<${coinType}>`,
      })),
      {
        StructType: spoolAccountPackageId,
      },
    ],
  };

  const [allOwnedObjects, marketData, spoolData] = await Promise.all([
    getOwnedObjects(client, owner, { filter: filterOwnerObject }),
    cache.getItem<MarketJobResult>(marketKey, {
      prefix,
      networkId: NetworkId.sui,
    }),
    cache.getItem<SpoolJobResult>(spoolsKey, {
      prefix: spoolsPrefix,
      networkId: NetworkId.sui,
    }),
  ]);

  const fetchedDataIncomplete =
    !marketData ||
    !spoolData ||
    allOwnedObjects.length === 0 ||
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
  const lendingAssets: { [key: string]: UserLending } = {};
  const stakedAccount: UserStakeAccounts = {};
  for (const ownedMarketCoin of allOwnedObjects) {
    const objType = ownedMarketCoin.data?.type;
    if (!objType) continue;

    const parsed = parseStructTag(objType);
    const coinType = normalizeStructTag(
      objType.substring(
        objType.indexOf('MarketCoin<') + 11,
        objType.indexOf('>')
      )
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = ownedMarketCoin.data?.content?.fields as any;
    const coinName = poolValues
      .find((value) => value.coinType === coinType)
      ?.metadata?.symbol.toLowerCase();
    if (!coinName || !fields) continue;
    if (!lendingAssets[coinName]) {
      lendingAssets[coinName] = { coinType, amount: new BigNumber(0) };
    }
    if (fields['stakes']) {
      if (!stakedAccount[`s${coinName}`]) {
        stakedAccount[`s${coinName}`] = [];
      }
      stakedAccount[`s${coinName}`].push({
        points: fields['points'],
        index: fields['index'],
        stakes: fields['stakes'],
      });
    }
    const balance = BigNumber(
      (parsed.name === 'Coin' ? fields['balance'] : fields['stakes']) ?? 0
    );
    lendingAssets[coinName] = {
      ...lendingAssets[coinName],
      amount: lendingAssets[coinName].amount.plus(balance),
    };
  }

  // add support for new sCoin
  allOwnedObjects
    .filter((obj) => {
      const objType = obj.data?.type;
      if (!objType) return false;

      const parsed = parseStructTag(objType);
      const subParsed = parsed.typeParams[0] as unknown as StructTag;
      if (
        parsed.name !== 'Coin' ||
        !sCoinToCoinName[subParsed.name.toLowerCase() as sCoinNames]
      )
        return false;

      return true;
    })
    .forEach((sCoin) => {
      if (!sCoin.data) return;
      const types = parseStructTag(sCoin.data.type);
      const firstCoin = types.typeParams[0] as unknown as StructTag;
      const coinName = firstCoin.name.toLowerCase() as sCoinNames;
      const sCoinType =
        `${firstCoin.address}::${firstCoin.module}::${firstCoin.name}` as sCoinTypeValue;
      // need to use the underlying asset type
      const underlyingCoinType = sCoinTypeToCoinTypeMap[sCoinType];
      const lendingAssetName = sCoinToCoinName[coinName];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = sCoin.data?.content?.fields as any;
      if (!lendingAssets[lendingAssetName]) {
        lendingAssets[lendingAssetName] = {
          amount: new BigNumber(fields['balance'] ?? 0),
          coinType: underlyingCoinType,
        };
      } else {
        lendingAssets[lendingAssetName].amount = lendingAssets[
          lendingAssetName
        ].amount.plus(new BigNumber(fields['balance'] ?? 0));
      }
    });

  let pendingReward = BigNumber(0);

  for (const spoolCoin of Object.keys(stakedAccount)) {
    for (const { points, index, stakes } of stakedAccount[spoolCoin]) {
      if (spoolData[spoolCoin]) {
        const increasedPointRate = spoolData[spoolCoin].currentPointIndex
          ? BigNumber(
              BigNumber(spoolData[spoolCoin].currentPointIndex).minus(index)
            ).dividedBy(baseIndexRate)
          : 0;
        pendingReward = pendingReward.plus(
          BigNumber(stakes)
            .multipliedBy(increasedPointRate)
            .plus(points)
            .multipliedBy(spoolData[spoolCoin].exchangeRateNumerator)
            .dividedBy(spoolData[spoolCoin].exchangeRateDenominator)
        );
      }
    }
  }

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

  for (const [assetName, assetValue] of Object.entries(lendingAssets)) {
    if (assetValue.amount.isZero()) continue;

    const market = marketData[assetName];
    if (!market) continue;

    const addressMove = formatMoveTokenAddress(assetValue.coinType);
    const tokenPrice = tokenPrices.get(addressMove);
    const lendingAmount = assetValue.amount
      .multipliedBy(lendingRate.get(assetName) ?? 0)
      .shiftedBy(-1 * (pools[assetName]?.metadata?.decimals ?? 0))
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
        apr: market.supplyInterestRate,
      },
    ]);
    suppliedAssets.push(assetToken);
  }
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
