import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, addressEndpoint, addressPrefix as prefix} from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const resp = await axios.get(
    addressEndpoint
  );
  
  if(!resp.data) return;

  await cache.setItem(
    resp.data.id,
    {
      ...resp.data,
    },
    {
      prefix,
      networkId: NetworkId.sui
    }
  )
};

const job: Job = {
  id: `${platformId}-address`,
  executor,
};
export default job;
