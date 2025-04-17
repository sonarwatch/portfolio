import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { driftProgram, perpMarketsIndexesKey, platformId } from './constants';
import { perpMarketStruct } from './struct';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { perpMarketsFilters } from './filters';
import { getOraclePrice } from './perpHelpers/getOraclePrice';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const marketAccounts = await getParsedProgramAccounts(
    client,
    perpMarketStruct,
    driftProgram,
    perpMarketsFilters
  );
  const indexes: Array<[number, string]> = marketAccounts.map(
    (m) => [m.marketIndex, m.pubkey.toString()] as const
  );
  await cache.setItem(perpMarketsIndexesKey, indexes, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  for (let i = 0; i < marketAccounts.length; i++) {
    const acc = marketAccounts[i];
    await getOraclePrice(
      acc.amm.oracle.toString(),
      acc.amm.oracleSource,
      client
    );
  }
};

const job: Job = {
  id: `${platformId}-perp-markets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
