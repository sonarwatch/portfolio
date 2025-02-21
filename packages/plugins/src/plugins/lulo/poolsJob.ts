import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { luloProgramId, platformId, poolsKey } from './constants';
import { poolStruct } from './struct';

export type AllocationInfo = {
  mint: string;
  pPrice: number;
  lPrice: number;
};

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const pools = await getParsedProgramAccounts(
    client,
    poolStruct,
    luloProgramId,
    [{ dataSize: poolStruct.byteSize }]
  );

  const allocations: AllocationInfo[] = [];
  for (const pool of pools) {
    for (const allocation of pool.allocations) {
      allocations.push({
        mint: allocation.mint.toString(),
        pPrice: allocation.protectedAmount
          .dividedBy(pool.protectedTotalSupply)
          .toNumber(),
        lPrice: allocation.regularAmount
          .minus(allocation.pendingWithdrawals)
          .dividedBy(pool.regularTotalSupply)
          .toNumber(),
      });
    }
  }

  await cache.setItem<AllocationInfo[]>(poolsKey, allocations, {
    prefix: platformId,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  labels: ['normal'],
};
export default job;
