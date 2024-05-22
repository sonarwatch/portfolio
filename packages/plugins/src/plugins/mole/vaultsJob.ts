import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  dataUrl,
  platformId, dataKey, vaultsPrefix, positionsKey
} from './constants';
import {
  MoleData,
  PositionInfo,
  VaultInfo
} from './types';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';

const executor: JobExecutor = async (cache: Cache) => {
  if (!process.env['MOLE_API_KEY'])
    throw Error('MOLE_API_KEY is not defined');

  const res = await axios.get<MoleData>(dataUrl, {
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
  
  await cache.setItem(dataKey, data, {
    prefix: vaultsPrefix,
    networkId: NetworkId.sui,
  });

  const client = getClientSui();

  const vaultInfos = await multiGetObjects<VaultInfo>(client, data.vaults.map(v => v.vaultInfo));

  const positionObjectIds: string[] = [];

  vaultInfos.forEach(vaultInfo => {
    if (vaultInfo.data?.content?.fields.value.fields.positions.fields.id.id)
      positionObjectIds.push(vaultInfo.data?.content?.fields.value.fields.positions.fields.id.id);
  })

  const positionsByVault = await Promise.all(positionObjectIds.map(positionObjectId => getDynamicFieldObjects<PositionInfo>(client, positionObjectId)))

  const positions = positionsByVault.flat().map(position => ({
      id: position.data?.content?.fields.name,
      owner: position.data?.content?.fields.value.fields.owner,
      worker: position.data?.content?.fields.value.fields.worker
    }));

  await cache.setItem(positionsKey, positions, {
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
