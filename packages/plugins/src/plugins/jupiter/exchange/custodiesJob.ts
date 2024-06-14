import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../../utils/solana';
import { dataStructSizeFilter } from '../../../utils/solana/filters';
import {
  custodiesKey,
  perpPoolsKey,
  perpsProgramId,
  platformId,
} from './constants';
import { Custody, custodyStruct, perpetualPoolStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const custodiesAccs = await getParsedProgramAccounts(
    client,
    custodyStruct,
    perpsProgramId,
    dataStructSizeFilter(custodyStruct)
  );
  if (custodiesAccs.length === 0) return;
  const custodyAccsInfo = custodiesAccs.map((acc) => ({
    pubkey: acc.pubkey.toString(),
    ...(acc as Custody),
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
  label: 'normal',
};
export default job;
