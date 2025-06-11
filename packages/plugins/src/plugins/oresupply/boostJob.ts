import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { orePid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { boostStruct, Config, configStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const [configAccounts, boostAccounts] = await Promise.all([
    ParsedGpa.build(connection, configStruct, orePid)
      .addFilter('accountDiscriminator', [101, 0, 0, 0, 0, 0, 0, 0])
      .run(),
    ParsedGpa.build(connection, boostStruct, orePid)
      .addDataSizeFilter()
      .addFilter('accountDiscriminator', [100, 0, 0, 0, 0, 0, 0, 0])
      .run(),
  ]);

  const config: Config = {
    ...configAccounts[0],
    boosts: configAccounts[0].boosts.filter(
      (b) => b.toString() !== '11111111111111111111111111111111'
    ),
  };

  await cache.setItem('config', config, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

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
