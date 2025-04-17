import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { platformId, poolsKey, poolsPubkey } from './constants';
import { PoolsStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const pools = await getParsedAccountInfo(client, PoolsStruct, poolsPubkey);
  if (!pools) throw new Error('Clone Pools not found');

  await cache.setItem(poolsKey, pools.pools, {
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
