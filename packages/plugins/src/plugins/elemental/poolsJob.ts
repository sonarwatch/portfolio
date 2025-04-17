import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, poolsCacheKey, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { poolStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const pools = await ParsedGpa.build(client, poolStruct, programId)
    .addDataSizeFilter(254)
    .run();

  if (pools.length === 0) return;

  await cache.setItem(poolsCacheKey, pools, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
