//

import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, configStoresKey } from './constants';
import { ConfigStores, PoolsConfig } from './types';
import { getClientAptos } from '../../utils/clients';
import { getDecimals } from '../../utils/aptos/getDecimals';

const executor: JobExecutor = async (cache: Cache) => {
  const res = await axios.get<unknown, AxiosResponse<PoolsConfig>>(
    'https://data.aptin.io/api/config-v2'
  );
  const configStores: ConfigStores = {};
  const client = getClientAptos();
  for (let i = 0; i < res.data.configStores.length; i++) {
    const configStore = res.data.configStores[i];
    const decimals = await getDecimals(client, configStore.coin_name);
    if (!decimals) continue;
    configStores[configStore.coin_name] = {
      ...configStore,
      decimals,
    };
  }
  await cache.setItem(configStoresKey, configStores, {
    prefix: platformId,
    networkId: NetworkId.aptos,
  });
};
const job: Job = {
  id: `${platformId}-deposits`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
