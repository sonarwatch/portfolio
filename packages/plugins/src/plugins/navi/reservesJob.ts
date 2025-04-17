import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import {
  platformId,
  reserveParentId,
  reservesKey,
  reservesPrefix,
} from './constants';
import { ReserveData } from './types';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const reservesDatas: ReserveData[] = [];

  let error;
  let index = 0;
  do {
    const reserve = await getDynamicFieldObject<ReserveData>(client, {
      parentId: reserveParentId,
      name: { type: 'u8', value: index },
    });
    if (reserve.data?.content?.fields) {
      const reserveData = reserve.data.content.fields;
      if (reserveData.value) reservesDatas.push(reserveData);
    }
    index += 1;
    error = reserve.error;
  } while (!error || index > 25);

  await cache.setItem(reservesKey, reservesDatas, {
    prefix: reservesPrefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-reserves`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
