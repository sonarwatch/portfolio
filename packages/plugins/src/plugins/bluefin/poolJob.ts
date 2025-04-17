import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { aquaVault, platformId, poolKey } from './constants';
import { getObject } from '../../utils/sui/getObject';
import { getClientSui } from '../../utils/clients';
import { Vault } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const vault = await getObject<Vault>(client, aquaVault);

  if (!vault.data?.content?.fields) throw Error();

  await cache.setItem<Vault>(poolKey, vault.data?.content?.fields, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-pool`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};

export default job;
