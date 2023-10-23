import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getBalancerPools } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  await getBalancerPools(
    'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    NetworkId.ethereum,
    cache
  );
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
