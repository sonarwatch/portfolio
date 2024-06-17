import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lastCountKey, platformId, tokensKey, whalesApi } from './constants';
import { TokensResponse } from './types';

const minToTake = 200;
const executor: JobExecutor = async (cache: Cache) => {
  const lastCount = await cache.getItem<number>(lastCountKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  const apiRes: AxiosResponse<TokensResponse> | null = await axios
    .get(whalesApi, {
      params: { take: lastCount || minToTake, chain_id: 666666 },
    })
    .catch(() => null);

  if (apiRes?.data.data) {
    const tokens = apiRes.data.data.list;
    await cache.setItem(tokensKey, tokens, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
    await cache.setItem(lastCountKey, apiRes.data.data.count, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-tokens`,
  executor,
  label: 'normal',
};
export default job;
