import { TokenPriceSource } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { walletTokensPlatform } from '../tokens/constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { cmcTokens, platformId } from './constants';
import { QuotesRes } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  if (!process.env['PORTFOLIO_CMC_API_KEY'])
    throw Error('PORTFOLIO_CMC_API_KEY is not defined');

  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=${cmcTokens
    .map((t) => t.slug)
    .join(',')}&CMC_PRO_API_KEY=${process.env['PORTFOLIO_CMC_API_KEY']}`;

  const quotesRes: AxiosResponse<QuotesRes> = await axios.get(url);

  const sources: TokenPriceSource[] = [];

  Object.values(quotesRes.data.data || {}).forEach((coin) => {
    const tokenConf = cmcTokens.find((t) => t.slug === coin.slug);
    if (!tokenConf) return;

    tokenConf.tokens.forEach((token) => {
      sources.push({
        address: token.mint,
        id: `${platformId}-${coin.slug}`,
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
  labels: ['coingecko'],
};
export default job;
