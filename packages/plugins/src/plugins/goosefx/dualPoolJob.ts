import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { dualPoolPid, platformId } from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { PoolState, poolStateStruct } from './structs';
import { getClientSolana } from '../../utils/clients';
import { ParsedAccount } from '../../utils/solana';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const poolStates = await ParsedGpa.build(client, poolStateStruct, dualPoolPid)
    .addFilter('accountDiscriminator', [247, 237, 227, 245, 215, 195, 222, 70])
    .addDataSizeFilter(637)
    .run();

  const items: { key: string; value: ParsedAccount<PoolState> }[] = [];

  poolStates.forEach((poolState) => {
    items.push({
      key: poolState.pubkey.toString(),
      value: poolState,
    });
  });

  await cache.setItems(items, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-dual-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
