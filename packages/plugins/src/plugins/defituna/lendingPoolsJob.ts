import BigNumber from 'bignumber.js';
import {
  apyToApr,
  BorrowLendRate,
  borrowLendRatesPrefix,
  NetworkId,
} from '@sonarwatch/portfolio-core';
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

  const tokenPriceById = await cache.getTokenPricesAsMap(
    pools.map((p) => p.mint.toString()),
    NetworkId.solana
  );

  const items: { key: string; value: BorrowLendRate }[] = [];
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
      const tokenPrice = tokenPriceById.get(pool.mint.toString());
      if (tokenPrice) {
        const blRate: BorrowLendRate = {
          borrowedAmount: pool.borrowedFunds
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber(),
          depositedAmount: pool.depositedFunds
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber(),
          borrowYield: {
            apr: apyToApr(borrowApy.toNumber()),
            apy: borrowApy.toNumber(),
          },
          depositYield: {
            apr: apyToApr(supplyApy.toNumber()),
            apy: supplyApy.toNumber(),
          },
          utilizationRatio: utilization,
          platformId,
          tokenAddress: pool.mint.toString(),
          ref: pool.pubkey.toString(),
        };

        items.push({
          key: `${pool.pubkey.toString()}-${pool.mint.toString()}`,
          value: blRate,
        });
      }

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
  await cache.setItems(items, {
    prefix: borrowLendRatesPrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-lending-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
