import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementMultiple,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
  parseTypeString,
} from '@sonarwatch/portfolio-core';

import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import tokenPriceToAssetTokens from '../../../utils/misc/tokenPriceToAssetTokens';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { getClientAptos } from '../../../utils/clients';
import {
  CoinStoreData,
  coinStore,
  getAccountResources,
  isCoinStoreRessourceType,
} from '../../../utils/aptos';
import { walletTokensPlatform } from '../constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, owner);
  if (!resources) return [];

  const walletTokensAssets: PortfolioAssetToken[] = [];
  const liquiditiesByPlatformId: Record<string, PortfolioLiquidity[]> = {};

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const resourceType = resource.type;
    if (!isCoinStoreRessourceType(resourceType)) continue;

    const parseCoinType = parseTypeString(resourceType);
    if (parseCoinType.root !== coinStore) continue;
    if (!parseCoinType.keys) continue;

    const coinType = parseCoinType.keys.at(0)?.type;
    if (coinType === undefined) continue;

    const coinStoreData = resource.data as CoinStoreData;
    const rawAmount = new BigNumber(coinStoreData.coin.value);
    if (rawAmount.isZero()) continue;

    const tokenPrice = await cache.getTokenPrice(coinType, NetworkId.aptos);
    if (!tokenPrice) continue;

    const amount = rawAmount.div(10 ** tokenPrice.decimals).toNumber();
    if (amount === 0) continue;

    if (tokenPrice.platformId !== walletTokensPlatform.id) {
      const assets = tokenPriceToAssetTokens(
        coinType,
        amount,
        NetworkId.aptos,
        tokenPrice
      );
      const liquidity: PortfolioLiquidity = {
        assets,
        assetsValue: getUsdValueSum(assets.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: 0,
        value: getUsdValueSum(assets.map((a) => a.value)),
        yields: [],
        name: tokenPrice.liquidityName,
      };
      if (!liquiditiesByPlatformId[tokenPrice.platformId]) {
        liquiditiesByPlatformId[tokenPrice.platformId] = [];
      }
      liquiditiesByPlatformId[tokenPrice.platformId].push(liquidity);
    } else {
      walletTokensAssets.push(
        tokenPriceToAssetToken(coinType, amount, NetworkId.aptos, tokenPrice)
      );
    }
  }

  const elements: PortfolioElement[] = [];
  if (walletTokensAssets.length > 0) {
    const walletTokensElement: PortfolioElementMultiple = {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.aptos,
      platformId: walletTokensPlatform.id,
      label: 'Wallet',
      value: getUsdValueSum(walletTokensAssets.map((a) => a.value)),
      data: {
        assets: walletTokensAssets,
      },
    };
    elements.push(walletTokensElement);
  }

  for (const [platformId, liquidities] of Object.entries(
    liquiditiesByPlatformId
  )) {
    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.aptos,
      platformId,
      label: 'LiquidityPool',
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      data: {
        liquidities,
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-aptos`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
