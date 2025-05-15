import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { luloProgramId, platformId, poolsKey } from './constants';
import { poolStruct } from './struct';
import { APIResponse } from './types';

export type AllocationInfo = {
  mint: string;
  pPrice: number;
  lPrice: number;
  pApy: number;
  lApy: number;
};

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const [pools, apiInfo] = await Promise.all([
    getParsedProgramAccounts(client, poolStruct, luloProgramId, [
      { dataSize: poolStruct.byteSize },
    ]),
    axios.get<APIResponse>('https://api.lulo.fi/v1/pool.getPools'),
  ]);

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
        pApy: apiInfo.data.protected.apy,
        lApy: apiInfo.data.regular.apy,
      });
    }
  }

  await cache.setItem<AllocationInfo[]>(poolsKey, allocations, {
    prefix: platformId,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
