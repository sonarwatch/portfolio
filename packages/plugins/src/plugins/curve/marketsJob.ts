import { NetworkId, ethereumNetwork } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { marketsCachePrefix, platformId } from './constants';
import { getClientAptos } from '../../utils/clients';
import { getRpcEndpoint, getUrlEndpoint } from '../../utils/clients/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const network = ethereumNetwork;
  // const endpoint = getUrlEndpoint(network.id);

  // await cache.setItem('market_id', 'market_object', {
  //   prefix: marketsCachePrefix,
  //   networkId: NetworkId.ethereum,
  // });
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
