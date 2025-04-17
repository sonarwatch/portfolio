import axios, { AxiosResponse } from 'axios';
import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, ptTokensApiUrl } from './constants';
import { PtToken } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res: AxiosResponse<{
    data: PtToken[];
  }> = await axios.get(ptTokensApiUrl);

  /* const tokenPrices = await cache.getTokenPricesAsMap(
    res.data.data.map((ptToken) => ptToken.baseAssetMint),
    NetworkId.solana
  ); */

  const tokenPriceSources: TokenPriceSource[] = [];

  res.data.data.forEach((ptToken) => {
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
  });

  await cache.setTokenPriceSources(tokenPriceSources);
};

const job: Job = {
  id: `${platformId}-pt-prices`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
