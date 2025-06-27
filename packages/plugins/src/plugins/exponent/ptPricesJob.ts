import axios, { AxiosResponse } from 'axios';
import {
  NetworkId,
  TokenPriceSource,
  TokenYield,
  yieldFromApy,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, ptTokensApiUrl } from './constants';
import { PtToken } from './types';

type PriceHistoryDatum = {
  v: number;
  t: number;
};

const executor: JobExecutor = async (cache: Cache) => {
  const res: AxiosResponse<{
    data: PtToken[];
  }> = await axios.get(ptTokensApiUrl);

  /* const tokenPrices = await cache.getTokenPricesAsMap(
    res.data.data.map((ptToken) => ptToken.baseAssetMint),
    NetworkId.solana
  ); */

  const tokenPriceSources: TokenPriceSource[] = [];
  const tokenYieldsSources: TokenYield[] = [];

  for (const ptToken of res.data.data) {
    // const baseTokenPrice = tokenPrices.get(ptToken.baseAssetMint);
    const tokenPriceSource: TokenPriceSource = {
      address: ptToken.mint,
      decimals: ptToken.decimals,
      id: ptToken.marketAddress,
      networkId: NetworkId.solana,
      platformId,
      price: ptToken.priceInUsd,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Income',
      label: 'Deposit',
      link: 'https://www.exponent.finance/income',
    };

    const marketHistory = await axios.get<{
      data: { ptYield: { week: PriceHistoryDatum[] } };
    }>(
      `https://web-api.exponent.finance/api/market-history/${ptToken.marketAddress}`
    );

    if (marketHistory.data.data?.ptYield?.week) {
      const priceHistoryDatum = marketHistory.data.data.ptYield.week.reduce(
        (max, item) => (item.t > max.t ? item : max)
      );

      tokenYieldsSources.push({
        address: ptToken.mint,
        networkId: NetworkId.solana,
        yield: yieldFromApy(priceHistoryDatum.v),
        timestamp: Date.now(),
      });
    }

    /* if (baseTokenPrice) {
      tokenPriceSource.underlyings = [
        {
          address: ptToken.baseAssetMint,
          amountPerLp: ptToken.priceInBaseAsset,
          decimals: baseTokenPrice.decimals,
          networkId: baseTokenPrice.networkId,
          price: baseTokenPrice.price,
        },
      ];
    } */

    tokenPriceSources.push(tokenPriceSource);
  }

  await Promise.all([
    cache.setTokenPriceSources(tokenPriceSources),
    cache.setTokenYields(tokenYieldsSources),
  ]);
};

const job: Job = {
  id: `${platformId}-pt-prices`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
