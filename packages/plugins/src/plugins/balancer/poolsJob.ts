import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getBalancerPoolsV2 } from './helpers';

const poolConfigs = [
  {
    url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    networkId: NetworkId.ethereum,
  },
  {
    url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-avalanche-v2',
    networkId: NetworkId.avalanche,
  },
  {
    url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
    networkId: NetworkId.polygon,
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  for (let i = 0; i < poolConfigs.length; i++) {
    const poolConfig = poolConfigs[i];
    await getBalancerPoolsV2(poolConfig.url, poolConfig.networkId, cache);
  }
};
const job: Job = {
  id: `${platformId}-pools-v2`,
  executor,
};
export default job;
