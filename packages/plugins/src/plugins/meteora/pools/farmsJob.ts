import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { dataSizeFilter } from '../../../utils/solana/filters';
import { farmProgramId, farmsKey, platformId } from '../constants';
import { farmStruct } from '../struct';
import { formatFarm } from '../helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const farms = await getParsedProgramAccounts(
    client,
    farmStruct,
    farmProgramId,
    dataSizeFilter(502)
  );

  const fFarms = farms.map((f) => formatFarm(f));
  await cache.setItem(farmsKey, fFarms, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-farms`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
