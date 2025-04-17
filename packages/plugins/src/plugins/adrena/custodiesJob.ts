import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { custodiesCacheKey, pid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { custodyStruct } from './structs';
import { custodiesFilters } from './filters';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const custodies = await getParsedProgramAccounts(
    client,
    custodyStruct,
    pid,
    custodiesFilters
  );

  if (!custodies) return;

  await cache.setItem(custodiesCacheKey, custodies, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-custodies`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
