import { NetworkId } from '@sonarwatch/portfolio-core';
import { farmingPackageId, farmingPoolsKey, platformId } from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientAptos } from '../../utils/clients';
import { getAccountResource } from '../../utils/aptos';
import { Farming } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientAptos();

  const farming = await getAccountResource<Farming>(
    connection,
    farmingPackageId,
    `${farmingPackageId}::farming::Farming`
  );

  if (!farming) return;

  await cache.setItem(farmingPoolsKey, farming.pool_info, {
    prefix: platformId,
    networkId: NetworkId.aptos,
  });
};

const job: Job = {
  id: `${platformId}-farming-pools`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
