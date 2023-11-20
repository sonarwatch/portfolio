import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { klendProgramId, platformId } from './constants';
import { lendingMarketStruct } from './structs/klend';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const lendingMarketAccounts = await getParsedProgramAccounts(
    client,
    lendingMarketStruct,
    klendProgramId,
    dataSizeFilter(lendingMarketStruct)
  );
  if (lendingMarketAccounts.length !== 0) await cache.setItem();
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
};
export default job;
