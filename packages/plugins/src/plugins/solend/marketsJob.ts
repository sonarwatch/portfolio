import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  marketsPrefix as prefix,
  platformId,
  marketsEndpoint,
} from './constants';
import { MarketInfo } from './types';
import { upperFirst } from './helpers';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';

const executor: JobExecutor = async (cache: Cache) => {
  const marketsInfoRes: AxiosResponse<MarketInfo[]> = await axios.get(
    marketsEndpoint
  );
  const marketsInfo = marketsInfoRes.data;
  for (const marketInfo of marketsInfo) {
    await cache.setItem(
      marketInfo.address,
      {
        ...marketInfo,
        name: upperFirst(marketInfo.name),
      },
      {
        prefix,
        networkId: NetworkId.solana,
      }
    );
  }
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
  label: 'normal',
};
export default job;
