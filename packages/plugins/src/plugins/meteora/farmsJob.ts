import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { farmProgramId, farmsKey, platformId } from './constants';
import { farmStruct } from './struct';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const farms = await getParsedProgramAccounts(
    client,
    farmStruct,
    farmProgramId,
    dataSizeFilter(502)
  );

  await cache.setItem(farmsKey, farms, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-farms`,
  executor,
  label: 'normal',
};
export default job;
