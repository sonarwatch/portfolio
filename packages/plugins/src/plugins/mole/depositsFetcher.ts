import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioLiquidity,
  TokenPrice,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  magicCoin,
  platformId,
  stackedSavingsParentIds,
  suiIncentiveUserType,
  dataKey,
  vaultsPrefix,
} from './constants';
import { getClientSui } from '../../utils/clients';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { UserInfo, Vault } from './types';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [data, coinsBalances, stackedSavings] = await Promise.all([
    cache.getItem<{ vaults: Vault[] }>(dataKey, {
      prefix: vaultsPrefix,
      networkId: NetworkId.sui,
    }),
    client.getAllBalances({ owner }),
    Promise.all(
      stackedSavingsParentIds.map((stackedSavingsParentId) =>
        getDynamicFieldObject<UserInfo>(client, {
          parentId: stackedSavingsParentId,
          name: {
            type: suiIncentiveUserType,
            value: { address: owner, is_object: false },
          },
        })
      )
    ),
  ]);

  if (!data || !data.vaults) {
    return [];
  }

  const vaultsMap: Map<string, Vault> = new Map();
  data.vaults.forEach((vault) => {
    if (!vault) return;
    vaultsMap.set(formatMoveTokenAddress(vault.baseToken), vault);
  });

  const coinsTypes: string[] = [];
  const balances: { type: string; amountRaw: number; stacked?: boolean }[] = [];

  for (let i = 0; i < coinsBalances.length; i++) {
    const coinBalance = coinsBalances[i];
    const amountRaw = Number(coinBalance.totalBalance);
    if (amountRaw === 0) continue;

    if (!coinBalance.coinType.includes(magicCoin)) continue;

    const { keys: parsedType } = parseTypeString(coinBalance.coinType);

    if (!parsedType) continue;

    if (!coinsTypes.includes(parsedType[0].type))
      coinsTypes.push(parsedType[0].type);

    balances.push({
      type: parsedType[0].type,
      amountRaw,
    });
  }

  for (let i = 0; i < stackedSavings.length; i++) {
    const stackedSaving = stackedSavings[i];
    if (!stackedSaving.data?.content?.fields) continue;
    const amountRaw = Number(
      stackedSaving.data.content.fields.value.fields.amount
    );
    if (amountRaw === 0) continue;

    if (!stackedSaving.data?.content?.type.includes(magicCoin)) continue;

    const parsedTypeString = parseTypeString(stackedSaving.data?.content?.type);
    if (!parsedTypeString.keys) continue;
    const { keys: parsedSubType } = parseTypeString(
      parsedTypeString.keys[1].type
    );
    if (!parsedSubType) continue;
    const { keys: parsedSubSubType } = parseTypeString(parsedSubType[0].type);
    if (!parsedSubSubType) continue;

    if (!coinsTypes.includes(parsedSubSubType[0].type))
      coinsTypes.push(parsedSubSubType[0].type);

    balances.push({
      type: parsedSubSubType[0].type,
      amountRaw,
      stacked: true,
    });
  }

  const tokenPrices: Map<string, TokenPrice> = await cache.getTokenPricesAsMap(
    coinsTypes,
    NetworkId.sui
  );

  const depositedLiquidities: PortfolioLiquidity[] = [];
  const stackedLiquidities: PortfolioLiquidity[] = [];

  for (let i = 0; i < balances.length; i++) {
    const coinBalance = balances[i];

    const tokenPrice = tokenPrices.get(
      formatMoveTokenAddress(coinBalance.type)
    );
    if (!tokenPrice) continue;

    const vault = vaultsMap.get(formatMoveTokenAddress(coinBalance.type));
    if (!vault) continue;

    const assets: PortfolioAsset[] = tokenPriceToAssetTokens(
      coinBalance.type,
      (Number(coinBalance.amountRaw) / 10 ** tokenPrice.decimals) *
        vault.baseTokenPerIbToken,
      NetworkId.sui,
      tokenPrice
    );

    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const value = assetsValue;

    const liquidity: PortfolioLiquidity = {
      value,
      assets,
      assetsValue,
      rewardAssets: [],
      rewardAssetsValue: null,
      yields: [],
    };

    if (coinBalance.stacked) stackedLiquidities.push(liquidity);
    else depositedLiquidities.push(liquidity);
  }

  const elements: PortfolioElement[] = [];

  if (depositedLiquidities.length > 0) {
    elements.push({
      type: 'liquidity',
      data: { liquidities: depositedLiquidities },
      label: 'Vault',
      networkId: NetworkId.sui,
      platformId,
      value: getUsdValueSum(depositedLiquidities.map((l) => l.value)),
    });
  }

  if (stackedLiquidities.length > 0) {
    elements.push({
      type: 'liquidity',
      data: { liquidities: stackedLiquidities },
      label: 'Staked',
      networkId: NetworkId.sui,
      platformId,
      value: getUsdValueSum(stackedLiquidities.map((l) => l.value)),
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
