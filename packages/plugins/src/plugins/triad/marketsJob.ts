import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { marketsCacheKey, platformId, programId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { marketV2Struct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const markets = await getParsedProgramAccounts(
    connection,
    marketV2Struct,
    programId,
    [
      {
        memcmp: {
          bytes: '5ZDUFgFupuY',
          offset: 0,
        },
      },
      {
        dataSize: 400,
      },
    ]
  );

  await cache.setItem(marketsCacheKey, markets, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
