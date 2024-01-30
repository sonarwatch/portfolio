import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataStructSizeFilter } from '../../utils/solana/filters';
import { custodiesKey, perpsProgramId, platformId } from './constants';
import { Custody, custodyStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const custodiesAccounts = await getParsedProgramAccounts(
    client,
    custodyStruct,
    perpsProgramId,
    dataStructSizeFilter(custodyStruct)
  );
  if (custodiesAccounts.length === 0) return;

  const accounts = custodiesAccounts.map((acc) => ({
    pubkey: acc.pubkey.toString(),
    ...(acc as Custody),
  }));

  await cache.setItem(custodiesKey, accounts, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-custodies`,
  executor,
  label: 'normal',
};
export default job;
