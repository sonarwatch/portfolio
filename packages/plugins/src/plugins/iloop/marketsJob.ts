import { NetworkId } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../utils/clients';
import { marketsCacheKey, platformId, programId } from './constants';
import { Cache } from '../../Cache';
import { getParsedProgramAccounts } from '../../utils/solana';
import { Job, JobExecutor } from '../../Job';
import { lendingMarketStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    lendingMarketStruct,
    programId,
    [
      {
        memcmp: {
          offset: 0,
          bytes: '8MMas8GHex6',
        },
      },
    ]
  );

  await cache.setItem(marketsCacheKey, accounts, {
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
