import { NetworkId } from '@sonarwatch/portfolio-core';

import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { platformId } from '../constants';
import { getEigenLayerWithdrawals } from '../helper';

const executor: JobExecutor = async (cache: Cache) => {
  // Get the YIELD positions
  const withdrawals = await getEigenLayerWithdrawals();

  // Cache the strategies and underlying tokens with decimals
  await cache.setItem(
    'eigenlayer-withdrawals',
    withdrawals.data.map((withdrawal) => ({
      stakerAddress: withdrawal.stakerAddress,
      delegatedTo: withdrawal.delegatedTo,
      withdrawerAddress: withdrawal.withdrawerAddress,
      shares: withdrawal.shares,
    })),
    {
      prefix: platformId,
      networkId: NetworkId.ethereum,
    }
  );
};

const job: Job = {
  id: `${platformId}-withdrawals`,
  executor,
  labels: ['normal'],
};

export default job;
