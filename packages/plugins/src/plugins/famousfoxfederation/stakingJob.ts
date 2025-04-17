import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  cachePrefix,
  stakingConfigCacheKey,
  platformId,
  stakingConfigAccount,
} from './constants';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { stakingConfigStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const [stakingConfig] = await getParsedMultipleAccountsInfo(
    connection,
    stakingConfigStruct,
    [stakingConfigAccount]
  );

  await cache.setItem(stakingConfigCacheKey, stakingConfig, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-staking`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
