import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { coingeckoMarketsUrl } from './constants';
import { CoingeckoMarketsRes } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const coingeckoRes: AxiosResponse<CoingeckoMarketsRes[]> | null = await axios
    .get(coingeckoMarketsUrl, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '100',
        page: '1',
      },
    })
    .catch(() => null);

  if (!coingeckoRes) return;
  if (coingeckoRes.status !== 200) return;
  const tokens = coingeckoRes.data;

  await cache.setItem(
    NetworkId.ethereum,
    tokens.map((token) => token.id),
    { prefix: 'topTokens' }
  );
};

const job: Job = {
  id: `topTokens`,
  executor,
};
export default job;
