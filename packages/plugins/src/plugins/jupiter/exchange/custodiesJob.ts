import { aprToApy, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../../utils/solana';
import {
  custodiesKey,
  jlpMint,
  jlpPoolPk,
  perpPoolsKey,
  perpsProgramId,
  platformId,
} from './constants';
import { custodyStruct, perpetualPoolStruct } from './structs';
import { custodiesFilters } from './filters';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const custodiesAccs = await getParsedProgramAccounts(
    client,
    custodyStruct,
    perpsProgramId,
    custodiesFilters()
  );
  if (custodiesAccs.length === 0) return;

  const custodyAccsInfo = custodiesAccs.map((acc) => ({
    ...acc,
    pubkey: acc.pubkey.toString(),
  }));

  const pools = (
    await getParsedMultipleAccountsInfo(
      client,
      perpetualPoolStruct,
      [...new Set(custodiesAccs.map((acc) => acc.pool.toString()))].map(
        (p) => new PublicKey(p)
      )
    )
  )
    .map((acc) => (acc === null ? [] : [acc]))
    .flat(1);

  await cache.setItem(custodiesKey, custodyAccsInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  await cache.setItem(perpPoolsKey, pools, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  const jlpPool = pools.find(
    (p) => p.pubkey.toString() === jlpPoolPk.toString()
  );
  if (jlpPool) {
    await cache.setTokenYield({
      address: jlpMint,
      networkId: NetworkId.solana,
      yield: {
        apr: jlpPool.poolApr.feeAprBps.shiftedBy(-4).toNumber(),
        apy: aprToApy(jlpPool.poolApr.feeAprBps.shiftedBy(-4).toNumber()),
      },
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-custodies`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
