import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId, stabilityEndpoint } from './constants';
import { LiquidityInfo } from './types';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';

const executor: JobExecutor = async (cache: Cache) => {
  const marketsInfoRes: AxiosResponse<LiquidityInfo> | null = await axios
    .get(stabilityEndpoint)
    .catch(() => null);
  if (
    marketsInfoRes !== null &&
    marketsInfoRes.data &&
    marketsInfoRes.data.data &&
    marketsInfoRes.data.data.apy &&
    typeof marketsInfoRes.data.data.apy === 'number'
  )
    cache.setItem('mod-apr', marketsInfoRes.data.data.apy, {
      prefix: `${platformId}-stabilityPool`,
    });
};

const job: Job = {
  id: `${platformId}-staking-apr`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
