import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetType,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioElementMultiple,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';

import BigNumber from 'bignumber.js';
import { tokenPriceToAssetToken } from '../../../utils/misc/tokenPriceToAssetToken';
import { walletTokensPlatform } from '../../../platforms';
import { getClientAptos } from '../../../utils/clients';
import {
  CoinStoreData,
  coinStore,
  getAccountResources,
  isCoinStoreRessourceType,
  parseTypeString,
} from '../../../utils/aptos';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, owner);
  if (!resources) return [];
  const walletTokens: PortfolioAsset[] = [];
  const lpTokens: Record<string, PortfolioLiquidity[]> = {};

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const resourceType = resource.type;
    if (!isCoinStoreRessourceType(resourceType)) continue;

    const parseCoinType = parseTypeString(resource.type);

    if (parseCoinType.root !== coinStore) continue;
    if (!parseCoinType.keys) continue;

    const coinType = parseCoinType.keys.at(0)?.type;
    if (coinType === undefined) continue;

    const tokenPrice = await cache.getTokenPrice(coinType, NetworkId.aptos);
    if (!tokenPrice) continue;

    const coinStoreData = resource.data as CoinStoreData;
    const amount = new BigNumber(coinStoreData.coin.value)
      .div(10 ** tokenPrice.decimals)
      .toNumber();
    if (amount === 0) continue;

    const price = tokenPrice?.price || null;
    const value = price ? amount * price : null;

    const asset: PortfolioAsset = {
      networkId: NetworkId.aptos,
      type: PortfolioAssetType.token,
      value,
      data: { address: coinType, price, amount },
    };
    if (tokenPrice.platformId !== walletTokensPlatform.id) {
      if (!tokenPrice.underlyings) continue;
      const underlyingsAsset: PortfolioAsset[] = [];

      tokenPrice.underlyings.forEach((underlying) => {
        if (!tokenPrice.underlyings) return;
        underlyingsAsset.push(
          tokenPriceToAssetToken(
            underlying.address,
            amount * underlying.amountPerLp,
            NetworkId.aptos,
            underlying
          )
        );
      });
      const lpToken: PortfolioLiquidity = {
        assets: underlyingsAsset,
        assetsValue: getUsdValueSum(underlyingsAsset.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: 0,
        value: getUsdValueSum(underlyingsAsset.map((a) => a.value)),
        yields: [],
      };
      if (lpTokens[tokenPrice.platformId] === undefined) {
        lpTokens[tokenPrice.platformId] = [];
      }
      lpTokens[tokenPrice.platformId].push(lpToken);
    } else {
      walletTokens.push(asset);
    }
  }
  const elements: PortfolioElement[] = [];
  if (walletTokens.length === 0) return [];
  const walletTokensElement: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.aptos,
    platformId: walletTokensPlatform.id,
    label: 'Wallet',
    value: getUsdValueSum(walletTokens.map((a) => a.value)),
    data: {
      assets: walletTokens,
    },
  };
  const platformIds = Object.keys(lpTokens);
  platformIds.forEach((platformId) => {
    const liquidityElement: PortfolioElementLiquidity = {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.aptos,
      platformId,
      label: 'LiquidityPool',
      value: getUsdValueSum(lpTokens[platformId].map((a) => a.value)),
      data: {
        liquidities: lpTokens[platformId],
      },
    };
    elements.push(liquidityElement);
  });
  elements.push(walletTokensElement);
  return elements;
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-aptos`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
