import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { dataUrl, platformId, dataKey, vaultsPrefix } from './constants';
import { MoleData } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  if (!process.env['PORTFOLIO_MOLE_API_KEY'])
    throw Error('PORTFOLIO_MOLE_API_KEY is not defined');

  const res = await axios
    .get<MoleData>(dataUrl, {
      timeout: 30000,
      headers: {
        key: process.env['PORTFOLIO_MOLE_API_KEY'],
      },
    })
    .catch((err) => {
      throw Error(`MOLE_API ERR: ${err}`);
    });

  if (!res) {
    throw Error(`MOLE_API NO RESPONSE`);
  }

  const { data } = res;

  if (!data || !data.vaults) {
    throw Error(`MOLE_API MISSING DATA`);
  }

  await cache.setItem(dataKey, data, {
    prefix: vaultsPrefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-data`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};

export default job;
