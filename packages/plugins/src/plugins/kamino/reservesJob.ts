import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { klendProgramId, platformId, reservesKey } from './constants';
import { Reserve, reserveStruct } from './structs/klend';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const reservesAccounts = await getParsedProgramAccounts(
    client,
    reserveStruct,
    klendProgramId,
    dataSizeFilter(reserveStruct)
  );
  if (reservesAccounts.length !== 0) {
    const reserveById: Record<string, Reserve> = {};
    for (const reserve of reservesAccounts) {
      reserveById[reserve.pubkey.toString()] = reserve;
    }
    await cache.setItem(reservesKey, reserveById, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-reserves`,
  executor,
};
export default job;
