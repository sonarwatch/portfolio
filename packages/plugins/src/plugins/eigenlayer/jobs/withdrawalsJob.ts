import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { chain, platformId } from '../constants';
import { getEigenLayerWithdrawals } from '../helper';

const executor: JobExecutor = async (cache: Cache) => {
  // Get the WITHDRAWALS positions
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
      networkId: chain,
    }
  );
};

const job: Job = {
  id: `${platformId}-withdrawals`,
  executor,
  labels: ['normal'],
};

export default job;
