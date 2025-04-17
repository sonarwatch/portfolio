import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { platformId, poolsKey, stakePid } from './constants';
import { stakePoolStruct } from './structs';
import { PoolInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const pools = await getParsedProgramAccounts(
    client,
    stakePoolStruct,
    stakePid,
    dataSizeFilter(stakePoolStruct.byteSize)
  );

  const poolsInfo: PoolInfo[] = [];
  for (const pool of pools) {
    poolsInfo.push({
      pubkey: pool.pubkey.toString(),
      mint: pool.mint.toString(),
    });
  }

  await cache.setItem(poolsKey, poolsInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
