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
import Decimal from 'decimal.js';
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
import { MarketJobResult, ObligationAccount, ObligationKeyFields, Pools } from './types';
import { formatDecimal, getOwnerObject } from './helpers';
import { getClientSui } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from "../../utils/misc/runInBatch";

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const elements: PortfolioElement[] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
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

  const collaterals: { [k: string]: number; } = {};
  const debts: { [k: string]: number; } = {};

  const debtsAndCollateralCalculationPromises = ownedObligationKeys.map((obligationKey) => async () => {
    const obligationKeyFields = getObjectFields(obligationKey) as ObligationKeyFields;
    if (!obligationKeyFields) return;
    const obligationId = obligationKeyFields.ownership.fields.of;
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
      if (!collaterals[fields.name]) {
        collaterals[fields.name] = 0;
      }
      const asset = getObjectFields(await client.getDynamicFieldObject({
        parentId: accountCollateralsId,
        name: {
          type: '0x1::type_name::TypeName',
          value: {
            name: fields.name,
          }
        }
      }));
      if (!asset) return;
      collaterals[fields.name] += Number(asset['value'].fields.amount ?? 0);
    });

    // get user debt
    const accountDebtsAssetsPromises = accountDebtsAssets.map(({ fields }) => async () => {
      const coinName = ctmValues.find((value) => value.coinType === normalizeStructTag(fields.name))?.metadata?.symbol.toLowerCase();
      if (!coinName) return;

      const market = marketData[coinName];
      if (!market) return

      if (!debts[fields.name]) {
        debts[fields.name] = 0;
      }
      const asset = getObjectFields(await client.getDynamicFieldObject({
        parentId: accountDebtsId,
        name: {
          type: '0x1::type_name::TypeName',
          value: {
            name: fields.name,
          }
        }
      }));
      if (!asset) return;
      debts[fields.name] += new Decimal(Number(asset['value'].fields.amount ?? 0)).mul(market.growthInterest + 1).toNumber();
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

  for (const coinType of Object.keys(collaterals)) {
    const metadata = ctmValues.find((value) => value.coinType === normalizeStructTag(coinType));
    const address = formatMoveTokenAddress(`0x${coinType}`);
    suppliedAssets.push(
      tokenPriceToAssetToken(
        address,
        formatDecimal(collaterals[coinType], metadata?.metadata?.decimals ?? 0),
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
      formatDecimal(debts[coinType], metadata?.metadata?.decimals ?? 0),
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
    name: 'Scallop Obligations',
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
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-obligations`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
