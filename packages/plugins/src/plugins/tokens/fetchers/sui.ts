import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementMultiple,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  formatMoveTokenAddress,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';

import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSui } from '../../../utils/clients';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { walletTokensPlatform } from '../constants';
import runInBatch from '../../../utils/misc/runInBatch';
import tokenPriceToAssetTokens from '../../../utils/misc/tokenPriceToAssetTokens';
import { getTag, parseTag } from './solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const coinsBalances = await client.getAllBalances({ owner });
  const coinsTypes = [...new Set(coinsBalances.map((cb) => cb.coinType))];
  console.log('constexecutor:FetcherExecutor= ~ coinsTypes:', coinsTypes);
  const results = await runInBatch(
    coinsTypes.map(
      (coinType) => () => cache.getTokenPrice(coinType, NetworkId.sui)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  results.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });
  const walletTokensAssets: PortfolioAssetToken[] = [];
  const liquiditiesByTag: Record<string, PortfolioLiquidity[]> = {};

  for (let i = 0; i < coinsBalances.length; i++) {
    const coinBalance = coinsBalances[i];
    const amountRaw = Number(coinBalance.totalBalance);
    if (amountRaw === 0) continue;

    const { coinType } = coinBalance;
    const tokenPrice = tokenPrices.get(formatMoveTokenAddress(coinType));
    if (!tokenPrice) continue;

    const amount = amountRaw / 10 ** tokenPrice.decimals;
    if (tokenPrice.platformId !== walletTokensPlatform.id) {
      const assets = tokenPriceToAssetTokens(
        coinType,
        amount,
        NetworkId.sui,
        tokenPrice
      );
      const liquidity: PortfolioLiquidity = {
        assets,
        assetsValue: getUsdValueSum(assets.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: 0,
        value: getUsdValueSum(assets.map((a) => a.value)),
        yields: [],
      };
      const tag = getTag(tokenPrice.platformId, tokenPrice.elementName);
      if (!liquiditiesByTag[tag]) {
        liquiditiesByTag[tag] = [];
      }
      liquiditiesByTag[tag].push(liquidity);
    } else {
      walletTokensAssets.push(
        tokenPriceToAssetToken(coinType, amount, NetworkId.sui, tokenPrice)
      );
    }
  }
  const elements: PortfolioElement[] = [];

  if (walletTokensAssets.length > 0) {
    const walletTokensElement: PortfolioElementMultiple = {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.sui,
      platformId: walletTokensPlatform.id,
      label: 'Wallet',
      value: getUsdValueSum(walletTokensAssets.map((a) => a.value)),
      data: {
        assets: walletTokensAssets,
      },
    };
    elements.push(walletTokensElement);
  }
  for (const [tag, liquidities] of Object.entries(liquiditiesByTag)) {
    const { platformId, elementName } = parseTag(tag);
    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.sui,
      platformId,
      name: elementName,
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
  id: `${walletTokensPlatform.id}-sui`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
