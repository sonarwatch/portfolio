import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, farmsInfoKey, poolsUrl } from './constants';
import { FarmInfo } from './types/farms';

const executor: JobExecutor = async (cache: Cache) => {
  const pools: AxiosResponse<FarmInfo[]> | null = await axios
    .get(poolsUrl, {
      headers: {
        Origin: 'https://www.app.kriya.finance/',
        Referer: 'https://www.app.kriya.finance',
        'X-Api-Key': 'xf40orKtic35JD39RVem77IOuSjb44FV5X7wSabU',
      },
    })
    .catch(() => null);

  if (!pools) return;

  const poolsInfo = [];
  for (const pool of pools.data) {
    if (pool.lspSupply === '0') continue;

    poolsInfo.push(pool);
  }

  await cache.setItem(farmsInfoKey, poolsInfo, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-farms`,
  executor,
  label: 'normal',
};
export default job;
