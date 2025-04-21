import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { orePid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { boostStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const boostAccounts = await ParsedGpa.build(connection, boostStruct, orePid)
    .addDataSizeFilter(boostStruct.byteSize)
    .addFilter('accountDiscriminator', [100, 0, 0, 0, 0, 0, 0, 0])
    .run();

  await cache.setItem('boosts', boostAccounts, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-boost`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
