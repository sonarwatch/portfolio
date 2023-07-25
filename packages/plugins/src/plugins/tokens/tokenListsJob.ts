import { assertNetworkId, networks } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';

const executor: JobExecutor = async (cache: Cache) => {
  for (const network in networks) {
    if (assertNetworkId(network)) {
      const networkId = assertNetworkId(network);
      const { tokenListUrl } = networks[networkId];
      const tokenList = await axios.get(tokenListUrl);
      await cache.setItem(networkId, tokenList.data, {
        prefix: 'tokenList',
      });
    }
  }
};
const job: Job = {
  id: `tokenLists`,
  executor,
};
export default job;
