import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { whirlpoolStrategyStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  console.log('Datasyze : ', whirlpoolStrategyStruct.byteSize);
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
