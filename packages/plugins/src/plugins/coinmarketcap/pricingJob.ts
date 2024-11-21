import { TokenPriceSource } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { walletTokensPlatform } from '../tokens/constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { cmcTokens, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=${cmcTokens
    .map((t) => t.slug)
    .join(',')}&CMC_PRO_API_KEY=${'86388059-e077-420d-8512-74496d323918'}`;

  const quotesRes: AxiosResponse<{
    data: {
      [key: string]: {
        slug: string;
        quote: {
          USD: {
            price: number;
          };
        };
      };
    };
  }> | null = await axios.get(url).catch(() => null);

  const sources: TokenPriceSource[] = [];

  Object.values(quotesRes?.data.data || {}).forEach((coin) => {
    const tokenConf = cmcTokens.find((t) => t.slug === coin.slug);
    if (!tokenConf) return;

    tokenConf.tokens.forEach((token) => {
      sources.push({
        address: token.mint,
        id: `coinmarketcap-${coin.slug}`,
        decimals: token.decimals,
        networkId: token.networkId,
        platformId: walletTokensPlatform.id,
        price: coin.quote.USD.price,
        timestamp: Date.now(),
        weight: 1,
      });
    });
  });

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  label: 'realtime',
};
export default job;
