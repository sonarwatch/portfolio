import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { daoPid, platformId, registrarsKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { registrarStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const registrars = await ParsedGpa.build(connection, registrarStruct, daoPid)
    .addDataSizeFilter(332)
    .run();

  await cache.setItem(registrarsKey, registrars, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-dao`,
  executor,
  labels: ['normal'],
};
export default job;
