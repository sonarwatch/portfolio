import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { lendingPoolKey, lendingPools, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { lendingPoolStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const lendingPoolAccounts = await getParsedMultipleAccountsInfo(
    connection,
    lendingPoolStruct,
    lendingPools
  );

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
