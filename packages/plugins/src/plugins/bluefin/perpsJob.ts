import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { metaUrl, platformId, perpetualIdsKey } from './constants';
import { PerpetualMeta } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res = await axios
    .get<PerpetualMeta[]>(metaUrl, {
      timeout: 3000,
    })
    .catch((err) => {
      throw Error(`BLUEFIN_API ERR: ${err}`);
    });

  if (!res || !res.data) {
    throw Error(`BLUEFIN_API NO RESPONSE`);
  }

  const perpIds = res.data.map((m) => m.perpetualAddress.id);
  await cache.setItem(perpetualIdsKey, perpIds, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-perps`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};

export default job;
