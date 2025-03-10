import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { defiTunaProgram, lendingPoolsCacheKey, platformId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { vaultStruct } from './structs';
import { rateFactor } from './helpers';

const SECONDS_IN_YEAR = 31536000;

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const pools = await getParsedProgramAccounts(
    connection,
    vaultStruct,
    defiTunaProgram,
    [
      {
        memcmp: {
          offset: 0,
          bytes: 'cJJWPqNMczr',
        },
      },
      {
        dataSize: 355,
      },
    ]
  );

  await cache.setItem(
    lendingPoolsCacheKey,
    pools.map((pool) => {
      const utilization = pool.depositedFunds.isGreaterThan(0)
        ? new BigNumber(pool.borrowedFunds)
            .dividedBy(pool.depositedFunds)
            .toNumber()
        : 0;
      const borrowApy = new BigNumber(pool.interestRate)
        .multipliedBy(SECONDS_IN_YEAR)
        .dividedBy(2 ** 60)
        .multipliedBy(rateFactor(utilization));

      const supplyApy = borrowApy.multipliedBy(utilization);

      return {
        ...pool,
        supplyApy,
        borrowApy,
      };
    }),
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
};

const job: Job = {
  id: `${platformId}-lending-pools`,
  executor,
  labels: ['normal'],
};

export default job;
