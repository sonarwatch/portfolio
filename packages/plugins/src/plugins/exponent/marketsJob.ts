import axios, { AxiosResponse } from 'axios';
import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { marketsApiUrl, marketsCacheKey, platformId } from './constants';
import { Market } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res: AxiosResponse<{
    data: Market[];
  }> = await axios.get(marketsApiUrl);

  const networkId = NetworkId.solana;

  const tokenPrices = await cache.getTokenPricesAsMap(
    res.data.data.map((market) => market.vault.mintAsset),
    networkId
  );

  const tokenPriceSources: TokenPriceSource[] = [];

  res.data.data.forEach((market) => {
    const baseTokenPrice = tokenPrices.get(market.vault.mintAsset);
    if (!baseTokenPrice) return;

    const ptPrice = baseTokenPrice.price * market.stats.ptPriceInAsset;
    const syPrice = baseTokenPrice.price * market.stats.syPriceInAsset;
    const ytPriceInAsset = 1 - market.stats.ptPriceInAsset;
    const ytPrice = baseTokenPrice.price * ytPriceInAsset;

    tokenPriceSources.push({
      address: market.id,
      decimals: market.vault.decimals,
      id: market.id,
      networkId,
      platformId,
      price:
        market.stats.ptAmountPerLpShare * ptPrice +
        market.stats.syAmountPerLpShare * syPrice,
      timestamp: Date.now(),
      weight: 1,
      underlyings: [
        {
          address: market.vault.mintPt,
          amountPerLp: market.stats.ptAmountPerLpShare,
          decimals: market.vault.decimals,
          networkId,
          price: ptPrice,
        },
        {
          address: market.vault.mintSy,
          amountPerLp: market.stats.syAmountPerLpShare,
          decimals: market.vault.decimals,
          networkId,
          price: syPrice,
        },
      ],
    });

    tokenPriceSources.push({
      address: market.vault.mintSy,
      decimals: market.vault.decimals,
      id: market.id,
      networkId,
      platformId,
      price: baseTokenPrice.price * market.stats.syPriceInAsset,
      timestamp: Date.now(),
      weight: 1,
      underlyings: [
        {
          address: baseTokenPrice.address,
          amountPerLp: market.stats.syPriceInAsset,
          decimals: baseTokenPrice.decimals,
          networkId,
          price: baseTokenPrice.price,
        },
      ],
    });

    tokenPriceSources.push({
      address: market.vault.mintYt,
      decimals: market.vault.decimals,
      id: market.id,
      networkId,
      platformId,
      price: ytPrice,
      timestamp: Date.now(),
      weight: 1,
      underlyings: [
        {
          address: baseTokenPrice.address,
          amountPerLp: ytPriceInAsset,
          decimals: baseTokenPrice.decimals,
          networkId,
          price: baseTokenPrice.price,
        },
      ],
    });
  });

  await Promise.all([
    cache.setItem(marketsCacheKey, res.data.data, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
    cache.setTokenPriceSources(tokenPriceSources),
  ]);
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
  label: 'normal',
};

export default job;
