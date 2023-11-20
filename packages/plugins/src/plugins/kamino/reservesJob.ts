import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { klendProgramId, platformId } from './constants';
import { reserveStruct } from './structs/klend';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const reservesAccounts = await getParsedProgramAccounts(
    client,
    reserveStruct,
    klendProgramId,
    dataSizeFilter(reserveStruct)
  );
  const promises = [];
  console.log(
    'constexecutor:JobExecutor= ~ reserveAccountStruct:',
    reserveStruct.byteSize
  );
  console.log(
    'constexecutor:JobExecutor= ~ lendingMarketAccounts:',
    reservesAccounts.length
  );
  for (const reserve of reservesAccounts) {
    promises.push(cache.setItem());
  }
};

const job: Job = {
  id: `${platformId}-reserves`,
  executor,
};
export default job;
