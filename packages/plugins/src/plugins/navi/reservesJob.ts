import { getObjectFields } from '@mysten/sui.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { platformId, poolsInfos, reservePrefix } from './constants';
import { ReserveData } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const reserves = await client.multiGetObjects({
    ids: poolsInfos.map((p) => p.reserveData),
    options: {
      showContent: true,
      showDisplay: false,
      showType: true,
      showBcs: false,
      showPreviousTransaction: true,
      showOwner: true,
      showStorageRebate: true,
    },
  });
  for (const reserve of reserves) {
    if (!reserve.data) continue;
    if (reserve.data.type && !reserve.data.type.includes('ReserveData'))
      continue;
    const fields = getObjectFields(reserve.data) as ReserveData;
    if (!fields.id.id) continue;
    await cache.setItem(fields.id.id, fields, {
      prefix: reservePrefix,
      networkId: NetworkId.sui,
    });
  }
};

const job: Job = {
  id: `${platformId}-reserves`,
  executor,
};
export default job;
