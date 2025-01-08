import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { marketPrefix as prefix } from './constants';
import type { Pools } from './types';

import {
  queryMarkets,
  queryPoolAddress,
  queryPools,
  querySCoins,
  querySpools,
} from './jobs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const addressData = (await queryPoolAddress(cache));
  if (!addressData) return;

  const pools = (await queryPools(
    client,
    addressData,
    cache
  )) as Required<Pools>;
  await Promise.allSettled([
    queryMarkets(client, pools, addressData, cache),
    querySCoins(client, addressData, cache),
    querySpools(client, addressData, cache),
  ]);
};

const job: Job = {
  id: prefix,
  executor,
  label: 'normal',
};

export default job;
