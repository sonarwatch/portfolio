import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { packageReserveData, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const reserves = await client.getCoins({
    parentId: packageReserveData,
  });
  console.log('constexecutor:JobExecutor= ~ reserves:', reserves);
};

const job: Job = {
  id: `${platformId}-reserves`,
  executor,
};
export default job;
