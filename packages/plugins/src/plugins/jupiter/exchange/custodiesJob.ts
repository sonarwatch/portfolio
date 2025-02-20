import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../../utils/solana';
import {
  custodiesKey,
  perpPoolsKey,
  perpsProgramId,
  platformId,
} from './constants';
import { custodyStruct, perpetualPoolStruct } from './structs';
import { custodiesFilters } from './filters';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const custodiesAccs = await getParsedProgramAccounts(
    client,
    custodyStruct,
    perpsProgramId,
    custodiesFilters()
  );
  if (custodiesAccs.length === 0) return;

  const custodyAccsInfo = custodiesAccs.map((acc) => ({
    ...acc,
    pubkey: acc.pubkey.toString(),
  }));

  const pools = (
    await getParsedMultipleAccountsInfo(
      client,
      perpetualPoolStruct,
      custodiesAccs.map((acc) => acc.pool)
    )
  )
    .map((acc) => (acc === null ? [] : [acc]))
    .flat(1);

  await cache.setItem(custodiesKey, custodyAccsInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  await cache.setItem(perpPoolsKey, pools, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-custodies`,
  executor,
  labels: ['normal'],
};
export default job;
