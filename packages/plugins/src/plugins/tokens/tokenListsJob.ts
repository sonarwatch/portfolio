import { networks } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { tokenListsPrefix } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  for (const network of Object.values(networks)) {
    const tokenList = await axios.get(network.tokenListUrl).catch(() => null);
    if (!tokenList) continue;
    await cache.setItem(network.id, tokenList.data, {
      prefix: tokenListsPrefix,
    });
  }
};

const job: Job = {
  id: 'token-lists',
  executor,
};
export default job;
