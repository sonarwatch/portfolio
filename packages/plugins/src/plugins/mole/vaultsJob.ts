import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  dataUrl,
  platformId, vaultsKey, vaultsPrefix
} from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  if (!process.env['MOLE_API_KEY'])
    throw Error('MOLE_API_KEY is not defined');

  const res = await axios.get(dataUrl, {
    timeout: 30000,
    headers: {
      key: process.env['MOLE_API_KEY']
    }
  }).catch(err => {
    throw Error(`MOLE_API ERR: ${err}`);
  })

  if (!res) {
    throw Error(`MOLE_API NO RESPONSE`);
  }

  const {data} = res

  if (!data || !data.vaults) {
    throw Error(`MOLE_API MISSING DATA`);
  }
  
  await cache.setItem(vaultsKey, {vaults: data.vaults}, {
    prefix: vaultsPrefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;
