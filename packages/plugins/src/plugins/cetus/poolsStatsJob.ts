import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { clmmPoolsPrefix, platformId } from './constants';
import { PoolStat } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const apiRes: AxiosResponse<{
    data: {
      pools: {
        swap_account: string;
        vol_in_usd: string;
        vol_in_usd_24h: string;
        apr_24h: string;
        apr_7day: string;
        apr_30day: string;
      }[];
    };
  }> = await axios.get(`https://api-sui.cetus.zone/v2/sui/swap/count`);

  const cacheItems: { key: string; value: PoolStat }[] = [];

  apiRes.data.data.pools.forEach((p) => {
    cacheItems.push({
      key: p.swap_account,
      value: {
        vol_in_usd: p.vol_in_usd,
        apr_24h: p.apr_24h,
        apr_7day: p.apr_7day,
        apr_30day: p.apr_30day,
        vol_in_usd_24h: p.vol_in_usd_24h,
      },
    });
  });

  // always use getPools helper to retrieve cetus pools
  await cache.setItems(cacheItems, {
    prefix: `${clmmPoolsPrefix}-stats`,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-pools-stats`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
