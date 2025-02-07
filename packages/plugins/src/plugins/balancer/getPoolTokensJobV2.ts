import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';

const executor: JobExecutor = async () => {};
const job: Job = {
  id: `${platformId}-pool-tokens-v2`,
  executor,
  label: 'normal',
};
export default job;
