import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { marketPrefix as prefix } from './constants';
import type { Pools } from './types';

import {
  queryAddress,
  queryMarkets,
  queryPools,
  querySCoins,
  querySpools,
} from './jobs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const address = await queryAddress(cache);
  if (!address) return;

  const pools = (await queryPools(client, address, cache)) as Required<Pools>;
  await Promise.allSettled([
    queryMarkets(client, pools, cache),
    querySCoins(client, address, cache),
    querySpools(client, address, cache),
  ])
};

const job: Job = {
  id: prefix,
  executor,
  label: 'normal',
};

export default job;
