import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  platformId,
  gaugesCachePrefix,
  gaugesAddresesCachePrefix,
} from './constants';
import { getAllGaugesData } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const allGauges = await getAllGaugesData();

  for (const [networkId, gauges] of Object.entries(allGauges)) {
    for (let i = 0; i < gauges.length; i++) {
      const gauge = gauges[i];
      await cache.setItem(gauge.gauge, gauge, {
        networkId: networkId as NetworkIdType,
        prefix: gaugesCachePrefix,
      });
    }
    const gaugeAddresses = gauges.map((g) => g.gauge);
    await cache.setItem(gaugesAddresesCachePrefix, gaugeAddresses, {
      prefix: gaugesAddresesCachePrefix,
      networkId: networkId as NetworkIdType,
    });
  }
};
const job: Job = {
  id: `${platformId}-gauges`,
  networkIds: [NetworkId.ethereum, NetworkId.polygon, NetworkId.avalanche],
  executor,
  labels: ['normal', NetworkId.ethereum],
};
export default job;
