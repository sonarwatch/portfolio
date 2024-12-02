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
  marketKey,
  obligationKeyType,
  platformId,
  poolsKey,
  poolsPrefix,
  marketPrefix as prefix,
} from './constants';
import {
  MarketJobResult,
  ObligationAccount,
  ObligationKeyFields,
  Pools,
  UserObligations,
} from './types';
import { shortenAddress } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';
import { CollateralAsset, DebtAsset } from './types/obligation';
import { getObject } from '../../utils/sui/getObject';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const coinTypeMetadata = await cache.getItem<Pools>(poolsKey, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui,
  });
  if (!coinTypeMetadata) return [];

  const ctmValues = Object.values(coinTypeMetadata);
  if (ctmValues.length === 0) return [];

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
  if (!marketData || ownedObligationKeys.length === 0) return [];

  const userObligations: UserObligations = {};

  const debtsAndCollateralCalculationPromises = ownedObligationKeys.map(
    (obligationKey) => async () => {
      const obligationKeyFields = obligationKey.data?.content?.fields;
      if (!obligationKeyFields) return;
      const obligationId = obligationKeyFields.ownership.fields.of;
      if (!userObligations[obligationId]) {
        userObligations[obligationId] = {
          collaterals: {},
          debts: {},
        };
      }
      const getObjectRes = await getObject<ObligationAccount>(
        client,
        obligationId
      );
      const account = getObjectRes.data?.content?.fields;
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
            const coinName = ctmValues
              .find(
                (value) => value.coinType === normalizeStructTag(fields.name)
              )
              ?.metadata?.symbol.toLowerCase();
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
            userObligations[obligationId].debts[fields.name] = userObligations[
              obligationId
            ].debts[fields.name].plus(
              BigNumber(asset.value.fields.amount ?? 0).multipliedBy(
                market.growthInterest + 1
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

  const tokenAddresses = ctmValues.map((value) => value.coinType);
  const tokenPrices = await cache.getTokenPricesAsMap(
    tokenAddresses,
    NetworkId.sui
  );

  for (const account of Object.keys(userObligations)) {
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];

    const { collaterals, debts } = userObligations[account];

    for (const coinType of Object.keys(collaterals)) {
      const metadata = ctmValues.find(
        (value) => value.coinType === normalizeStructTag(coinType)
      );
      const address = formatMoveTokenAddress(`0x${coinType}`);
      suppliedAssets.push(
        tokenPriceToAssetToken(
          address,
          collaterals[coinType]
            .shiftedBy(-1 * (metadata?.metadata?.decimals ?? 0))
            .toNumber(),
          NetworkId.sui,
          tokenPrices.get(address)
        )
      );
      suppliedYields.push([]);
    }
    for (const coinType of Object.keys(debts)) {
      const metadata = ctmValues.find(
        (value) => value.coinType === normalizeStructTag(coinType)
      );
      const coinName = metadata?.metadata?.symbol.toLowerCase() ?? '';
      const market = marketData[coinName];
      if (!market) continue;
      const address = formatMoveTokenAddress(`0x${coinType}`);
      borrowedAssets.push(
        tokenPriceToAssetToken(
          address,
          debts[coinType]
            .shiftedBy(-1 * (metadata?.metadata?.decimals ?? 0))
            .toNumber(),
          NetworkId.sui,
          tokenPrices.get(address)
        )
      );
      borrowedYields.push([
        {
          apr: market.borrowInterestRate,
          apy: aprToApy(market.borrowInterestRate),
        },
      ]);
    }
    if (
      suppliedAssets.length === 0 &&
      borrowedAssets.length === 0 &&
      rewardAssets.length === 0
    )
      continue;

    const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });
    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.sui,
      platformId,
      label: 'Lending',
      name: `Obligation ID: ${shortenAddress(account, 5, 3)}`,
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
