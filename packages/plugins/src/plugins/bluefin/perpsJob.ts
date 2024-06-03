import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { perpetualsKey, metaUrl, platformId } from './constants';
import { PerpetualMeta, PerpetualV2 } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getClientSui } from '../../utils/clients';

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

  const client = getClientSui();
  const perpetuals = await multiGetObjects<PerpetualV2>(
    client,
    res.data.map((m) => m.perpetualAddress.id)
  );

  await cache.setItem(perpetualsKey, perpetuals, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-perps`,
  executor,
  label: 'normal',
};

export default job;
