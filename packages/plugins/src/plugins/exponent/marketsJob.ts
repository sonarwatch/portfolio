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
    const price = new BigNumber(tokenPriceMintAsset.price)
      .multipliedBy(market.stats.syPriceInAsset)
      .toNumber();

    tokenPriceSources.push({
      address: market.vault.mintSy,
      decimals: market.vault.decimals,
      id: market.vault.id,
      networkId: NetworkId.solana,
      platformId,
      price,
      timestamp: Date.now(),
      weight: 1,
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
  labels: ['normal'],
};

export default job;
