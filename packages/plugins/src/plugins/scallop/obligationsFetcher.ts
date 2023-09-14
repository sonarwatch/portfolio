import { NetworkId, PortfolioAsset, PortfolioElement, PortfolioElementType, TokenPrice, Yield, aprToApy, formatMoveTokenAddress, getElementLendingValues } from '@sonarwatch/portfolio-core';
import { SuiObjectDataFilter, getObjectFields, normalizeStructTag } from '@mysten/sui.js';
import Decimal from 'decimal.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketKey, obligationKeyPackageId, platformId, marketPrefix as prefix } from './constants';
import { CollateralAsset, DebtAsset, MarketJobResult } from './types';
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

  const collaterals: { [T in string]: number } = {};
  const debts: { [T in string]: number } = {};

  for (const obligation of allOwnedObjects) {
    const obligationFields = getObjectFields(obligation);
    if (!obligationFields) continue;
    const obligationId = obligationFields['ownership'].fields.of;
    const account = getObjectFields(await client.getObject({
      id: obligationId,
      options: {
        showContent: true,
      }
    }));
    if (!account) continue;

    const accountCollateralsId = account['collaterals'].fields.table.fields.id.id;
    const accountDebtsId = account['debts'].fields.table.fields.id.id;
    const accountCollateralsAssets = account['collaterals'].fields.keys.fields.contents as CollateralAsset[];
    const accountDebtsAssets = account['debts'].fields.keys.fields.contents as DebtAsset[];

    await Promise.all([
      Promise.all(
        accountCollateralsAssets.map(async ({ fields }) => {
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
          collaterals[fields.name] += Number(asset['value'].fields.amount ?? 0)
        })
      ),

      Promise.all(
        accountDebtsAssets.map(async ({ fields }) => {
          const coinName = ctmValues.find((value) => value.coinType === normalizeStructTag(fields.name))?.metadata?.symbol.toLowerCase();
          if (!coinName) return;
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
          const market = marketData[coinName];
          if (!asset || !market) return;
          debts[fields.name] = new Decimal(Number(asset['value'].fields.amount ?? 0)).mul(market.growthInterest + 1).toNumber();
        })
      )
    ])
  }

  const tokenAddresses = ctmValues.map((value) => formatMoveTokenAddress(value.coinType))
  const tokenPriceResult = await runInBatch([...tokenAddresses].map(
    (address) => () => cache.getTokenPrice(address, NetworkId.sui)
  ))
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResult.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  })

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
