import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, poolsV2InfoKey, poolsUrl } from './constants';
import { FarmInfo } from './types/farms';

const executor: JobExecutor = async (cache: Cache) => {
  const pools: AxiosResponse<FarmInfo[]> | null = await axios
    .get(poolsUrl, {
      headers: {
        Origin: 'https://www.app.kriya.finance/',
        Referer: 'https://www.app.kriya.finance',
        'X-Api-Key': '5cWNE5fK92jWsfeidBCD4eMBP23TYPL1Xdo3Bew9',
      },
    })
    .catch((er) => {
      throw new Error(
        `[Kriya] Unable to get pools info from APi. \n Error : ${er}`
      );
    });

  if (!pools) return;

  const poolsInfo = [];
  for (const pool of pools.data) {
    if (pool.lspSupply === '0') continue;

    poolsInfo.push(pool);
  }

  await cache.setItem(poolsV2InfoKey, poolsInfo, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-pools-farms-v2`,
  executor,
  label: 'normal',
};
export default job;