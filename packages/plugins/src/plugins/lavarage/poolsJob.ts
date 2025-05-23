import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { usdcPid, platformId, solPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { poolStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const pools = await Promise.all([
    ParsedGpa.build(connection, poolStruct, solPid)
      .addFilter('discriminator', [241, 154, 109, 4, 17, 177, 109, 188])
      .run(),
    ParsedGpa.build(connection, poolStruct, usdcPid)
      .addFilter('discriminator', [241, 154, 109, 4, 17, 177, 109, 188])
      .run(),
  ]);

  const poolsItems = pools
    .flat()
    .map((p) => ({ key: p.pubkey.toString(), value: p }));

  await cache.setItems(poolsItems, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
  networkIds: [NetworkId.solana],
  labels: ['normal'],
};
export default job;
