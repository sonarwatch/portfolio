import { Job, JobExecutor } from '../../Job';
import sleep from '../../utils/misc/sleep';
import { platformId } from './constants';

const executor: JobExecutor = async () =>
  // cache: Cache
  {
    await sleep(1000); // Simulating a delay for demonstration purposes
    console.log('This is a test of the convex fetcher');
  };
const job: Job = {
  id: `${platformId}-job`,
  executor,
  label: 'normal',
};
export default job;
