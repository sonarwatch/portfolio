import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { nxfinanceLendIdlItem, platformId, solayerPoolKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { SolayerPool } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const solayerPoolAccounts = await getAutoParsedProgramAccounts<SolayerPool>(
    connection,
    nxfinanceLendIdlItem,
    [
      {
        memcmp: {
          offset: 0,
          bytes: 'J27HTcn2xq3',
        },
      },
      {
        dataSize: 184,
      },
    ]
  );

  await cache.setItem(solayerPoolKey, solayerPoolAccounts, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-solayer-pools`,
  executor,
  labels: ['normal'],
};
export default job;
