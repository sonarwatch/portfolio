import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  // do some stuff
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  executor,
};
export default job;
