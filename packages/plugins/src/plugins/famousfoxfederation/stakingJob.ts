import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  cachePrefix,
  stakingConfigCacheKey,
  platformId,
  stakingConfigAccount,
  stakingIdlItem,
} from './constants';
import { StakingConfig } from './types';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const [stakingConfig] =
    await getAutoParsedMultipleAccountsInfo<StakingConfig>(
      connection,
      stakingIdlItem,
      [stakingConfigAccount]
    );

  await cache.setItem(stakingConfigCacheKey, stakingConfig, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-staking`,
  executor,
  labels: ['normal'],
};
export default job;
