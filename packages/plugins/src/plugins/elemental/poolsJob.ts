import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { elementalIdlItem, platformId, poolsCacheKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { poolFilter } from './filters';
import { poolStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const pools = await getParsedProgramAccounts(
    client,
    poolStruct,
    new PublicKey(elementalIdlItem.programId),
    poolFilter
  );

  if (pools.length === 0) return;

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
