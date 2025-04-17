import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { pid, platformId, tokenStatsKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { tokenStatsStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const tokenStatsAccounts = await ParsedGpa.build(
    connection,
    tokenStatsStruct,
    pid
  )
    .addFilter('accountDiscriminator', [7, 126, 25, 232, 73, 79, 202, 236])
    .run();

  await cache.setItem(tokenStatsKey, tokenStatsAccounts, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-token-stats`,
  executor,
  labels: ['normal'],
};
export default job;
