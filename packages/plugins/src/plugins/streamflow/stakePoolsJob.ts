import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, stakePid } from './constants';
import { getClientSolana } from '../../utils/clients';

import { Job, JobExecutor } from '../../Job';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { stakePoolStruct } from './structs';
import { StakePoolInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const stakePoolAccounts = await ParsedGpa.build(
    client,
    stakePoolStruct,
    stakePid
  )
    .addFilter('accountDiscriminator', [121, 34, 206, 21, 79, 127, 255, 28])
    .addDataSizeFilter(296)
    .run();

  const stakePools: StakePoolInfo[] = [];
  for (const stakePool of stakePoolAccounts) {
    // Empty Stake Pool
    if (stakePool.totalStake.isZero()) continue;

    stakePools.push({
      address: stakePool.pubkey.toString(),
      mint: stakePool.mint.toString(),
      stakeMint: stakePool.stakeMint.toString(),
    });
  }

  await cache.setItem('stakePools', stakePools, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-stakePools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
