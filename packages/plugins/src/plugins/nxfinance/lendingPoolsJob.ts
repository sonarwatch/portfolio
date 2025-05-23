import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lendingPoolKey, lendProgramId, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { lendingPoolStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const lendingPoolAccounts = await ParsedGpa.build(
    connection,
    lendingPoolStruct,
    lendProgramId
  )
    .addFilter('accountDiscriminator', [208, 40, 242, 82, 186, 18, 75, 36])
    .run();

  await cache.setItem(lendingPoolKey, lendingPoolAccounts, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-lending-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
