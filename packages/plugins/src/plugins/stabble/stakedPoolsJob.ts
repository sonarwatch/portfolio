import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { stakedPoolStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { StakePoolInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const pools = await ParsedGpa.build(connection, stakedPoolStruct, stakingPid)
    .addFilter('accountDiscriminator', [241, 154, 109, 4, 17, 177, 109, 188])
    .addDataSizeFilter(145)
    .run();

  const poolInfos: { key: string; value: StakePoolInfo }[] = [];

  pools.forEach((pool) => {
    poolInfos.push({
      key: pool.pubkey.toString(),
      value: {
        address: pool.pubkey.toString(),
        mint: pool.mint.toString(),
        rewarder: pool.rewarder.toString(),
      },
    });
  });

  await cache.setItems(poolInfos, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-staked-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
