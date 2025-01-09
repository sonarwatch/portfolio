import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { marketPrefix as prefix } from './constants';

import {
  queryAddress,
  queryMarkets,
  queryPoolAddress,
  querySpools,
} from './jobs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const [addressData, poolAddressData] = await Promise.all([
    queryAddress(cache),
    queryPoolAddress(cache),
  ]);
  if (!addressData || !poolAddressData) return;

  await Promise.allSettled([
    queryMarkets(client, poolAddressData, cache),
    querySpools(client, poolAddressData, cache),
  ]);
};

const job: Job = {
  id: prefix,
  executor,
  label: 'normal',
};

export default job;
