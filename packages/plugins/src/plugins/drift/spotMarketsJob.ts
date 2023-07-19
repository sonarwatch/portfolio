import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { DriftProgram, platformId, prefixSpotMarkets } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { spotMarketStruct } from './struct';
import { marketFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import { calculateUtilization } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const spotMarketsAccount = await getParsedProgramAccounts(
    client,
    spotMarketStruct,
    DriftProgram,
    marketFilter
  );
  if (!spotMarketsAccount) return;
  for (let index = 0; index < spotMarketsAccount.length; index++) {
    const spotMarketAccount = spotMarketsAccount[index];
    const apr = calculateUtilization(spotMarketAccount)
      .div(10 ** spotMarketAccount.decimals)
      .div(100)
      .toNumber();
    await cache.setItem(
      spotMarketsAccount[index].marketIndex.toString(),
      {
        ...spotMarketAccount,
        apr,
      },
      { prefix: prefixSpotMarkets, networkId: NetworkId.solana }
    );
  }
};

const job: Job = {
  id: `${platformId}-spotMarkets`,
  executor,
};
export default job;
