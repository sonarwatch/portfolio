import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, TokenPrice, Yield, aprToApy, formatMoveTokenAddress, getElementLendingValues } from '@sonarwatch/portfolio-core';
import { SuiObjectDataFilter, getObjectFields, normalizeStructTag } from '@mysten/sui.js';
import Decimal from 'decimal.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketKey, obligationKeyPackageId, platformId, marketPrefix as prefix } from './constants';
import { BorrowIndexData, CollateralAsset, DebtAsset, MarketJobResult } from './types';
import { formatDecimal, getCoinTypeMetadata, getOwnerObject } from './helpers';
import { getClientSui } from '../../utils/clients';
import runInBatch from '../../utils/misc/runInBatch';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const elements: PortfolioElement[] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const coinTypeMetadata = await getCoinTypeMetadata(cache);
  const ctmValues = Object.values(coinTypeMetadata);
  const filterOwnerObject: SuiObjectDataFilter = {
    MatchAny: [
      {
        StructType: obligationKeyPackageId,
      },
    ]
  }

  const [allOwnedObjects, marketData] = await Promise.all([
    getOwnerObject(owner, { filter: filterOwnerObject }),
    cache.getItem<MarketJobResult>(marketKey, {
      prefix,
      networkId: NetworkId.sui
    })
  ])
  if (!marketData || allOwnedObjects.length === 0) return [];
  const { borrowIndexes } = marketData
  if (!borrowIndexes) return [];

  const collaterals: { [T in string]: number } = {};
  const debts: { [T in string]: number } = {};

  for (const obligation of allOwnedObjects) {
    const obligationFields = getObjectFields(obligation);
    if (!obligationFields) continue;
    const obligationId = obligationFields['ownership'].fields.of;
    const account = await client.getObject({
      id: obligationId,
      options: {
        showContent: true,
      }
    });
    if (!account) continue;
    const accountFields = getObjectFields(account);
    if (!accountFields) continue;
    const accountCollateralsId = accountFields['collaterals'].fields.table.fields.id.id;
    const accountDebtsId = accountFields['debts'].fields.table.fields.id.id;

    const accountCollateralsAssets = accountFields['collaterals'].fields.keys.fields.contents as CollateralAsset[];
    const accountDebtsAssets = accountFields['debts'].fields.keys.fields.contents as DebtAsset[];
    await Promise.all([
      Promise.all(
        accountCollateralsAssets.map(async ({ fields }) => {
          if (!collaterals[fields.name]) {
            collaterals[fields.name] = 0;
          }

          const assetObject = await client.getDynamicFieldObject({
            parentId: accountCollateralsId,
            name: {
              type: '0x1::type_name::TypeName',
              value: {
                name: fields.name,
              }
            }
          });

          const assetFields = getObjectFields(assetObject);
          if (assetFields) {
            collaterals[fields.name] += Number(assetFields['value'].fields.amount ?? 0)
          }
        })
      ),

      Promise.all(
        accountDebtsAssets.map(async ({ fields }) => {
          const coinName = ctmValues.find((value) => value.coinType === normalizeStructTag(fields.name))?.metadata?.symbol.toLowerCase();
          if (!coinName) return;
          if (!debts[fields.name]) {
            debts[fields.name] = 0;
          }

          const assetObject = await client.getDynamicFieldObject({
            parentId: accountDebtsId,
            name: {
              type: '0x1::type_name::TypeName',
              value: {
                name: fields.name,
              }
            }
          })

          const assetFields = getObjectFields(assetObject);
          if (!assetFields) return;
          let debtAmount = Number(assetFields['value'].fields.amount ?? 0);
          const borrowIndexFields = borrowIndexes[coinName]?.['value'].fields;
          const currentTimestamp = Math.floor(new Date().getTime() / 1000);
          const timeDelta = new Decimal(currentTimestamp - Number(borrowIndexFields.last_updated));
          const interestRate = new Decimal(borrowIndexFields.interest_rate.fields.value).div(2 ** 32);
          const indexDelta = new Decimal(borrowIndexFields.borrow_index).mul(timeDelta.mul(interestRate));
          const currentBorrowIndex = new Decimal(borrowIndexFields.borrow_index).plus(
            indexDelta.div(new Decimal(borrowIndexFields.interest_rate_scale))
          );
          const currentDebtAmount = new Decimal(debtAmount).mul(
            currentBorrowIndex.div(assetFields['value'].fields.borrow_index)
          );
          debtAmount = currentDebtAmount.toNumber();
          debts[fields.name] = debtAmount;
        })
      )
    ])
  }

  const result: {collaterals: Map<string, {name: string, amount: number}>, debts: Map<string, {name: string, amount: number}>} = {
    collaterals: new Map(),
    debts: new Map(),
  };

  for (const coinType of Object.keys(collaterals)) {
    const metadata = ctmValues.find((value) => value.coinType === normalizeStructTag(coinType));
    result.collaterals.set(coinType, {
      name: metadata?.metadata?.symbol.toLowerCase() ?? '',
      amount: formatDecimal(collaterals[coinType], metadata?.metadata?.decimals ?? 0)
    })
  }
  for (const coinType of Object.keys(debts)) {
    const metadata = ctmValues.find((value) => value.coinType === normalizeStructTag(coinType));
    result.debts.set(coinType, {
      name: metadata?.metadata?.symbol.toLowerCase() ?? '',
      amount: formatDecimal(debts[coinType], metadata?.metadata?.decimals ?? 0)
    })
  }

  const tokenAddresses = ctmValues.map((value) => formatMoveTokenAddress(value.coinType))
  const tokenPriceResult = await await runInBatch([...tokenAddresses].map(
    (address) => () => cache.getTokenPrice(address, NetworkId.sui)
  ))
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResult.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  })

  result.collaterals.forEach((value, key) => {
    const address = formatMoveTokenAddress(`0x${key}`);
    suppliedAssets.push(tokenPriceToAssetToken(
      address,
      value.amount,
      NetworkId.sui,
      tokenPrices.get(address)
    ));
  })

  result.debts.forEach((value, key) => {
    const address = formatMoveTokenAddress(`0x${key}`);
    borrowedAssets.push(tokenPriceToAssetToken(
      address,
      value.amount,
      NetworkId.sui,
      tokenPrices.get(address)
    ));
    const borrowIndex = borrowIndexes[value.name]?.['value'].fields as BorrowIndexData;
    const borrowRate = Number(borrowIndex.interest_rate.fields.value) / 2 ** 32;
    const borrowRateScale = Number(borrowIndex.interest_rate_scale);
    const borrowYearFactor = 24 * 365 * 3600;

    const calculatedBorrowRate = (borrowRate * borrowYearFactor) / borrowRateScale

    borrowedYields.push([
      {
        apr: calculatedBorrowRate,
        apy: aprToApy(calculatedBorrowRate)
      }
    ])
  })

  const { borrowedValue, collateralRatio, suppliedValue, value } =
    getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.sui,
      platformId,
      label: 'Lending',
      name: 'Obligations',
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
    })
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-obligations`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
