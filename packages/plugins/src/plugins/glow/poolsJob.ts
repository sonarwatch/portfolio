import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { poolsCacheKey, platformId, poolProgramId } from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getClientSolana } from '../../utils/clients';
import { marginPoolStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const pools = await ParsedGpa.build(
    getClientSolana(),
    marginPoolStruct,
    poolProgramId
  )
    .addFilter('accountDiscriminator', [142, 255, 28, 32, 196, 168, 170, 175])
    .run();

  await cache.setItem(poolsCacheKey, pools, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
  labels: ['normal'],
};
export default job;
