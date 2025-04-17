import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lendProgramId, platformId, solayerPoolKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { solayerPoolStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const solayerPoolAccounts = await ParsedGpa.build(
    connection,
    solayerPoolStruct,
    lendProgramId
  )
    .addRawFilter(0, 'J27HTcn2xq3')
    .addDataSizeFilter(184)
    .run();

  await cache.setItem(solayerPoolKey, solayerPoolAccounts, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-solayer-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
