import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { poolsCacheKey, platformId, poolProgramId } from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getClientSolana } from '../../utils/clients';
import { marginPoolStruct } from './structs';
import { CalcMarginPool } from './types';
import { Number192 } from './Number192';

const executor: JobExecutor = async (cache: Cache) => {
  const pools = await ParsedGpa.build(
    getClientSolana(),
    marginPoolStruct,
    poolProgramId
  )
    .addFilter('accountDiscriminator', [142, 255, 28, 32, 196, 168, 170, 175])
    .run();

  const formattedPools: CalcMarginPool[] = pools.map((pool) => ({
    ...pool,
    depositNoteExchangeRate: BigNumber.max(
      1,
      Number192.fromBits(pool.borrowed_tokens)
        .toBigNumber()
        .plus(pool.deposit_tokens)
        .minus(Number192.fromBits(pool.uncollected_fees).toBigNumber())
    ).dividedBy(BigNumber.max(1, pool.deposit_notes)),
    loanNoteExchangeRate: BigNumber.max(
      1,
      Number192.fromBits(pool.borrowed_tokens).toBigNumber()
    ).dividedBy(BigNumber.max(1, pool.loan_notes)),
  }));

  await cache.setItem(poolsCacheKey, formattedPools, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
