import axios, { AxiosResponse } from 'axios';
import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { marketsApiUrl, marketsCacheKey, platformId } from './constants';
import { Market } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res: AxiosResponse<{
    data: Market[];
  }> = await axios.get(marketsApiUrl);

  const tokenPriceSources: TokenPriceSource[] = [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    res.data.data.map((market) => market.vault.mintAsset),
    NetworkId.solana
  );

  res.data.data.forEach((market) => {
    const tokenPriceMintAsset = tokenPrices.get(market.vault.mintAsset);
    if (!tokenPriceMintAsset) return;

    tokenPriceSources.push({
      address: market.vault.mintSy,
      decimals: market.vault.decimals,
      id: market.vault.id,
      networkId: NetworkId.solana,
      platformId,
      label: 'Deposit',
      price: new BigNumber(tokenPriceMintAsset.price)
        .multipliedBy(market.stats.syPriceInAsset)
        .toNumber(),
      underlyings: [
        {
          address: market.vault.mintAsset.toString(),
          amountPerLp: market.stats.syPriceInAsset,
          decimals: market.vault.decimals,
          networkId: NetworkId.solana,
          price: tokenPriceMintAsset.price,
        },
      ],
      timestamp: Date.now(),
      weight: 1,
    });

    /* tokenPriceSources.push({
      address: market.vault.mintYt,
      decimals: market.vault.decimals,
      id: market.vault.id,
      networkId: NetworkId.solana,
      platformId,
      label: 'Deposit',
      price: new BigNumber(tokenPriceMintAsset.price)
        .multipliedBy(1 - market.stats.ptPriceInAsset)
        .toNumber(),
      timestamp: Date.now(),
      weight: 1,
      link: 'https://www.exponent.finance/farm',
    }); */
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
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
