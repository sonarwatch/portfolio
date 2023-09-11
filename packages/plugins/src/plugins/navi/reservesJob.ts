import { getObjectFields } from '@mysten/sui.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  platformId,
  poolsInfos,
  reserveParentId,
  reservesKey,
  reservesPrefix,
} from './constants';
import { ReserveData } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const reservesDatas: ReserveData[] = [];
  for (const pool of poolsInfos) {
    const reserves = await client.getDynamicFieldObject({
      parentId: reserveParentId,
      name: { type: 'u8', value: pool.id.toString() },
    });

    if (reserves.data) {
      const fields = getObjectFields(reserves.data) as ReserveData;
      if (fields.value) reservesDatas.push(fields);
    }
  }
  await cache.setItem(reservesKey, reservesDatas, {
    prefix: reservesPrefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-reserves`,
  executor,
};
export default job;
