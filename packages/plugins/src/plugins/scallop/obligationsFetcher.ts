import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  aprToApy,
  formatMoveTokenAddress,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { normalizeStructTag } from '@mysten/sui/utils';
import BigNumber from 'bignumber.js';
import { SuiObjectDataFilter } from '@mysten/sui/client';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  baseIndexRate,
  borrowIncentivePoolsKey,
  borrowIncentivePoolsPrefix,
  marketKey,
  obligationKeyType,
  platformId,
  poolAddressKey,
  poolAddressPrefix,
  marketPrefix as prefix,
} from './constants';
import {
  BorrowIncentiveReward,
  MarketJobResult,
  ObligationKeyFields,
  PoolAddressMap,
  UserObligations,
} from './types';
import { hasSCoinPredicate, shortenAddress } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';
import {
  CollateralAsset,
  DebtAsset,
  ObligationFields,
} from './types/obligation';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';
import { queryMultipleObjects } from './util';
import { ObjectData, ObjectResponse, ParsedData } from '../../utils/sui/types';
import { queryBorrowIncentiveAccounts } from './queries';
import { BorrowIncentivePools } from './types/borrowIncentivePool';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];

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

  const filterOwnerObject: SuiObjectDataFilter = {
    MatchAny: [
      {
        StructType: obligationKeyType,
      },
    ],
  };

  const client = getClientSui();
  const [ownedObligationKeys, marketData] = await Promise.all([
    getOwnedObjectsPreloaded<ObligationKeyFields>(client, owner, {
      filter: filterOwnerObject,
    }),
    cache.getItem<MarketJobResult>(marketKey, {
      prefix,
      networkId: NetworkId.sui,
    }),
  ]);
  if (!marketData || ownedObligationKeys.length === 0) {
    return [];
  }

  const userObligations: UserObligations = {};
  const obligationObjects = await queryMultipleObjects<ObligationFields>(
    client,
    ownedObligationKeys
      .filter(
        (
          t
        ): t is ObjectResponse<ObligationKeyFields> & {
          data: ObjectData<ObligationKeyFields> & {
            content: ParsedData<ObligationKeyFields>;
          };
        } => !!t.data
      )
      .map((t) => t.data.content.fields.ownership.fields.of)
  );

  const debtsAndCollateralCalculationPromises = ownedObligationKeys.map(
    (obligationKey, idx) => async () => {
      const obligationKeyFields = obligationKey.data?.content?.fields;
      if (!obligationKeyFields) return;
      const obligationId = obligationKeyFields.ownership.fields.of;

      const obligationObject = obligationObjects[idx].data;
      if (!obligationObject) return;

      if (!userObligations[obligationId]) {
        userObligations[obligationId] = {
          collaterals: {},
          debts: {},
          obligation: {
            objectId: obligationObject.objectId,
            version: obligationObject.version,
            digest: obligationObject.digest,
          },
        };
      }

      const account = obligationObject.content?.fields;
      if (!account) return;

      const accountCollateralsId =
        account.collaterals.fields.table.fields.id.id;
      const accountDebtsId = account.debts.fields.table.fields.id.id;
      const accountCollateralsAssets =
        account.collaterals.fields.keys.fields.contents;
      const accountDebtsAssets = account.debts.fields.keys.fields.contents;

      // get user collateral
      const accountCollateralsAssetsPromises = accountCollateralsAssets.map(
        ({ fields }) =>
          async () => {
            if (!userObligations[obligationId].collaterals[fields.name]) {
              userObligations[obligationId].collaterals[fields.name] =
                BigNumber(0);
            }

            const rAsset = await getDynamicFieldObject<CollateralAsset>(
              client,
              {
                parentId: accountCollateralsId,
                name: {
                  type: '0x1::type_name::TypeName',
                  value: {
                    name: fields.name,
                  },
                },
              }
            );
            const asset = rAsset.data?.content?.fields;
            if (!asset) return;
            userObligations[obligationId].collaterals[fields.name] =
              userObligations[obligationId].collaterals[fields.name].plus(
                BigNumber(asset.value.fields.amount ?? 0)
              );
          }
      );

      // get user debt
      const accountDebtsAssetsPromises = accountDebtsAssets.map(
        ({ fields }) =>
          async () => {
            const { coinName } = poolAddress[normalizeStructTag(fields.name)];
            if (!coinName) return;

            const market = marketData[coinName];
            if (!market) return;

            if (!userObligations[obligationId].debts[fields.name]) {
              userObligations[obligationId].debts[fields.name] = BigNumber(0);
            }
            const rAsset = await getDynamicFieldObject<DebtAsset>(client, {
              parentId: accountDebtsId,
              name: {
                type: '0x1::type_name::TypeName',
                value: {
                  name: fields.name,
                },
              },
            });
            const asset = rAsset.data?.content?.fields;
            if (!asset) return;

            const accountBorrowIndex = Number(
              asset.value.fields.borrow_index ?? 0
            );
            const debIncreaseRate =
              accountBorrowIndex > 0
                ? marketData[coinName].borrowIndex / (accountBorrowIndex - 1)
                : 0;
            userObligations[obligationId].debts[fields.name] = userObligations[
              obligationId
            ].debts[fields.name].plus(
              BigNumber(asset.value.fields.amount ?? 0).multipliedBy(
                debIncreaseRate
              )
            );
          }
      );

      await Promise.all([
        runInBatch(accountCollateralsAssetsPromises, 5),
        runInBatch(accountDebtsAssetsPromises, 5),
      ]); // calculate collateral and debts at once, 3 coinType per batch
    }
  );

  await runInBatch(debtsAndCollateralCalculationPromises, 5); // run in batch of size 2, calculate 5 obligation account per batch

  const tokenAddresses = Object.keys(poolAddress);
  const tokenPrices = await cache.getTokenPricesAsMap(
    tokenAddresses,
    NetworkId.sui
  );

  const borrowIncentivePools = await cache.getItem<BorrowIncentivePools>(
    borrowIncentivePoolsKey,
    {
      prefix: borrowIncentivePoolsPrefix,
      networkId: NetworkId.sui,
    }
  );
  if (!borrowIncentivePools) {
    return [];
  }

  const sCoinTypeToCoinData = Object.values(poolAddress)
    .filter(hasSCoinPredicate)
    .reduce((acc, { sCoinType, coinType, coinName }) => {
      acc[sCoinType] = { coinType, coinName };
      return acc;
    }, {} as Record<string, { coinType: string; coinName: string }>);

  for (const [
    obligationId,
    { collaterals, debts, obligation },
  ] of Object.entries(userObligations)) {
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedWeights: number[] = [];
    const suppliedLtvs: number[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    const borrowIncentives: Record<string, BorrowIncentiveReward[]> = {};

    if (Object.values(debts).some((t) => !t.isZero())) {
      // Query borrow incentive accounts for the obligation
      const borrowIncentiveAccounts = await queryBorrowIncentiveAccounts(
        cache,
        client,
        {
          sender: owner,
          obligation,
        }
      );

      if (borrowIncentiveAccounts) {
        for (const [poolType, borrowIncentiveAccount] of Object.entries(
          borrowIncentiveAccounts
        )) {
          const borrowIncentivePool = borrowIncentivePools[poolType];
          if (!borrowIncentivePool) continue;

          const rewards: BorrowIncentiveReward[] = [];
          borrowIncentiveAccount.pointList.forEach(
            ({ pointType, weightedAmount, points, index }) => {
              const poolPoint = borrowIncentivePool.points[pointType];
              if (!poolPoint) return;

              const { coinName, decimals, coinType, symbol } = poolPoint;
              let availableClaimAmount = BigNumber(0);
              let availableClaimCoin = BigNumber(0);
              const accountBorrowedAmount = BigNumber(weightedAmount);
              const increasedPointRate = poolPoint.currentPointIndex
                ? Math.max(
                    BigNumber(poolPoint.currentPointIndex - index)
                      .dividedBy(baseIndexRate)
                      .toNumber(),
                    0
                  )
                : 1;
              availableClaimAmount = availableClaimAmount.plus(
                accountBorrowedAmount
                  .multipliedBy(increasedPointRate)
                  .plus(points)
              );
              availableClaimCoin = availableClaimAmount.shiftedBy(-decimals);

              // for veSCA
              const weightScale = BigNumber(1_000_000_000_000);
              const boostValue = BigNumber(weightedAmount)
                .div(
                  BigNumber(borrowIncentiveAccount.debtAmount)
                    .multipliedBy(poolPoint.baseWeight)
                    .dividedBy(weightScale)
                )
                .isFinite()
                ? BigNumber(weightedAmount)
                    .div(
                      BigNumber(borrowIncentiveAccount.debtAmount)
                        .multipliedBy(poolPoint.baseWeight)
                        .dividedBy(weightScale)
                    )
                    .toNumber()
                : 1;

              if (availableClaimAmount.isGreaterThan(0)) {
                rewards.push({
                  coinName,
                  coinType,
                  symbol,
                  decimals,
                  coinPrice:
                    (sCoinTypeToCoinData[coinType]
                      ? (() => {
                          // get the coin type that the scoin represents
                          const { coinType: coinAddress, coinName: assetName } =
                            sCoinTypeToCoinData[coinType];
                          const { conversionRate } = marketData[assetName];
                          return (
                            (tokenPrices.get(coinAddress)?.price ?? 0) *
                            (conversionRate ?? 1)
                          );
                        })()
                      : tokenPrices.get(coinType)?.price) ?? 0,
                  availableClaimAmount: availableClaimAmount.toNumber(),
                  availableClaimCoin: availableClaimCoin.toNumber(),
                  boostValue,
                });
              }
            }
          );

          if (rewards.length > 0) {
            borrowIncentives[poolType] = rewards;
          }
        }
      }
    }

    const borrowIncentiveRewards = Object.values(borrowIncentives).flat();
    rewardAssets.push(
      ...borrowIncentiveRewards.map(
        ({ coinPrice, coinType, availableClaimCoin }) =>
          tokenPriceToAssetToken(
            coinType,
            availableClaimCoin,
            NetworkId.sui,
            null,
            coinPrice,
            { isClaimable: true }
          )
      )
    );

    for (const coinType of Object.keys(collaterals)) {
      const poolData = poolAddress[normalizeStructTag(coinType)];
      if (!poolData) continue;

      const { decimals, coinName } = poolData;

      const market = marketData[coinName];
      if (!market) continue;

      const { collateralFactor } = market;

      const address = formatMoveTokenAddress(`0x${coinType}`);
      suppliedAssets.push(
        tokenPriceToAssetToken(
          address,
          collaterals[coinType].shiftedBy(-(decimals ?? 0)).toNumber(),
          NetworkId.sui,
          tokenPrices.get(address)
        )
      );
      suppliedLtvs.push(collateralFactor);
      suppliedYields.push([]);
    }

    for (const coinType of Object.keys(debts)) {
      const normalizedCoinType = normalizeStructTag(coinType);
      const poolData = poolAddress[normalizedCoinType];
      if (!poolData) continue;

      const { decimals, coinName } = poolData;

      const market = marketData[coinName];
      if (!market) continue;

      const { borrowWeight, borrowInterestRate } = market;

      const address = formatMoveTokenAddress(`0x${coinType}`);
      borrowedAssets.push(
        tokenPriceToAssetToken(
          address,
          debts[coinType].shiftedBy(-(decimals ?? 0)).toNumber(),
          NetworkId.sui,
          tokenPrices.get(address)
        )
      );
      borrowedWeights.push(borrowWeight);

      /**
       * Calculate the borrow yield.
       * Includes borrow incentive rewards in the calculation.
       *
       * Borrow yield = incentive reward APR - borrow interest rate.
       *
       * If reward APR > borrow interest rate, the user earns from borrowing;
       * otherwise, the user pays the borrow interest.
       *
       * Note: Reward APR is not permanent and may change over time.
       */

      const borrowedYield: Yield[] = [];

      // add the normal borrow interest rate
      borrowedYield.push({
        apr: -borrowInterestRate,
        apy: -aprToApy(borrowInterestRate),
      });
      borrowedYields.push(borrowedYield);

      // get current reward APR
      const rewardAprInfos = Object.values(
        borrowIncentivePools[normalizedCoinType]?.points ?? {}
      );
      if (rewardAprInfos.length === 0) continue;

      const borrowIncentive = borrowIncentives[normalizedCoinType];
      if (!borrowIncentive) continue;

      borrowedYield.push(
        ...rewardAprInfos.map(({ rewardApr, coinType: rewardCoinType }) => ({
          apr:
            rewardApr *
            (borrowIncentive.find((t) => t.coinType === rewardCoinType)
              ?.boostValue ?? 1),
          apy: aprToApy(rewardApr),
        }))
      );
    }

    if (
      suppliedAssets.length === 0 &&
      borrowedAssets.length === 0 &&
      rewardAssets.length === 0
    )
      continue;

    const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
      getElementLendingValues({
        suppliedAssets,
        borrowedAssets,
        rewardAssets,
        suppliedLtvs,
        borrowedWeights,
      });
    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.sui,
      platformId,
      label: 'Lending',
      name: `Obligation ID: ${shortenAddress(obligationId, 5, 3)}`,
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
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-obligations`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
