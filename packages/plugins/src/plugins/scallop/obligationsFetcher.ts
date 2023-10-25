import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  aprToApy,
  formatMoveTokenAddress,
  getElementLendingValues
} from '@sonarwatch/portfolio-core';
import { SuiObjectDataFilter, getObjectFields, normalizeStructTag } from '@mysten/sui.js';
import BigNumber from "bignumber.js";
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  marketKey,
  obligationKeyPackageId,
  platformId,
  poolsKey,
  poolsPrefix,
  marketPrefix as prefix
} from './constants';
import { MarketJobResult, ObligationAccount, ObligationKeyFields, Pools, UserObligations } from './types';
import { getOwnerObject, shortenAddress } from './helpers';
import { getClientSui } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from "../../utils/misc/runInBatch";
import { CollateralAsset, DebtAsset } from "./types/obligation";

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const elements: PortfolioElement[] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const coinTypeMetadata = await cache.getItem<Pools>(poolsKey, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui
  });
  if (!coinTypeMetadata) return [];

  const ctmValues = Object.values(coinTypeMetadata);
  if (ctmValues.length === 0) return [];

  const filterOwnerObject: SuiObjectDataFilter = {
    MatchAny: [
      {
        StructType: obligationKeyPackageId,
      },
    ]
  };

  const [ownedObligationKeys, marketData] = await Promise.all([
    getOwnerObject(owner, { filter: filterOwnerObject }),
    cache.getItem<MarketJobResult>(marketKey, {
      prefix,
      networkId: NetworkId.sui
    })
  ]);
  if (!marketData || ownedObligationKeys.length === 0) return [];

  const userObligations: UserObligations = {};

  const debtsAndCollateralCalculationPromises = ownedObligationKeys.map((obligationKey) => async () => {
    const obligationKeyFields = getObjectFields(obligationKey) as ObligationKeyFields;
    if (!obligationKeyFields) return;
    const obligationId = obligationKeyFields.ownership.fields.of;
    if (!userObligations[obligationId]) {
      userObligations[obligationId] = {
        collaterals: {},
        debts: {},
      };
    }
    const account = getObjectFields(await client.getObject({
      id: obligationId,
      options: {
        showContent: true,
      }
    })) as ObligationAccount;
    if (!account) return;

    const accountCollateralsId = account.collaterals.fields.table.fields.id.id;
    const accountDebtsId = account.debts.fields.table.fields.id.id;
    const accountCollateralsAssets = account.collaterals.fields.keys.fields.contents;
    const accountDebtsAssets = account.debts.fields.keys.fields.contents;

    // get user collateral
    const accountCollateralsAssetsPromises = accountCollateralsAssets.map(({ fields }) => async () => {
      if (!userObligations[obligationId].collaterals[fields.name]) {
        userObligations[obligationId].collaterals[fields.name] = BigNumber(0);
      }
      const asset = getObjectFields(await client.getDynamicFieldObject({
        parentId: accountCollateralsId,
        name: {
          type: '0x1::type_name::TypeName',
          value: {
            name: fields.name,
          }
        }
      })) as CollateralAsset | undefined;
      if (!asset) return;
      userObligations[obligationId].collaterals[fields.name] =
        userObligations[obligationId].collaterals[fields.name].plus(BigNumber(asset.value.fields.amount ?? 0));
    });

    // get user debt
    const accountDebtsAssetsPromises = accountDebtsAssets.map(({ fields }) => async () => {
      const coinName = ctmValues.find((value) => value.coinType === normalizeStructTag(fields.name))?.metadata?.symbol.toLowerCase();
      if (!coinName) return;

      const market = marketData[coinName];
      if (!market) return;

      if (!userObligations[obligationId].debts[fields.name]) {
        userObligations[obligationId].debts[fields.name] = BigNumber(0);
      }
      const asset = getObjectFields(await client.getDynamicFieldObject({
        parentId: accountDebtsId,
        name: {
          type: '0x1::type_name::TypeName',
          value: {
            name: fields.name,
          }
        }
      })) as DebtAsset | undefined;
      if (!asset) return;
      userObligations[obligationId].debts[fields.name] =
        userObligations[obligationId].debts[fields.name].plus(BigNumber(asset.value.fields.amount ?? 0).multipliedBy(market.growthInterest + 1));
    });

    await Promise.all([runInBatch(accountCollateralsAssetsPromises, 5), runInBatch(accountDebtsAssetsPromises, 5)]); // calculate collateral and debts at once, 3 coinType per batch
  });

  await runInBatch(debtsAndCollateralCalculationPromises, 5); // run in batch of size 2, calculate 5 obligation account per batch

  const tokenAddresses = ctmValues.map((value) => value.coinType);
  const tokenPriceResult = await cache.getTokenPrices(tokenAddresses, NetworkId.sui);
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResult.forEach((r) => {
    if (!r) return;
    tokenPrices.set(r.address, r);
  });

  for (const account of Object.keys(userObligations)) {
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];

    const { collaterals, debts } = userObligations[account];

    for (const coinType of Object.keys(collaterals)) {
      const metadata = ctmValues.find((value) => value.coinType === normalizeStructTag(coinType));
      const address = formatMoveTokenAddress(`0x${coinType}`);
      suppliedAssets.push(
        tokenPriceToAssetToken(
          address,
          collaterals[coinType].shiftedBy(-1 * (metadata?.metadata?.decimals ?? 0)).toNumber(),
          NetworkId.sui,
          tokenPrices.get(address)
        )
      );
    }
    for (const coinType of Object.keys(debts)) {
      const metadata = ctmValues.find((value) => value.coinType === normalizeStructTag(coinType));
      const coinName = metadata?.metadata?.symbol.toLowerCase() ?? '';
      const market = marketData[coinName];
      if (!market) continue;
      const address = formatMoveTokenAddress(`0x${coinType}`);
      borrowedAssets.push(tokenPriceToAssetToken(
        address,
        debts[coinType].shiftedBy(-1 * (metadata?.metadata?.decimals ?? 0)).toNumber(),
        NetworkId.sui,
        tokenPrices.get(address)
      ));
      borrowedYields.push([
        {
          apr: market.borrowInterestRate,
          apy: aprToApy(market.borrowInterestRate)
        }
      ]);
    }
    const { borrowedValue, collateralRatio, suppliedValue, value } = getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);
    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.sui,
      platformId,
      label: 'Lending',
      name: `${shortenAddress(account, 5, 3)} Obligations`,
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
