import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId, whirlpoolPrefix, whirlpoolProgram } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { whirlpoolStruct } from './structs/whirlpool';
import { whirlpoolFilters } from './filters';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const whirlpoolsInfo = await getParsedProgramAccounts(
    client,
    whirlpoolStruct,
    whirlpoolProgram,
    whirlpoolFilters
  );
  for (let id = 0; id < whirlpoolsInfo.length; id++) {
    const whirlpoolInfo = whirlpoolsInfo[id];
    if (whirlpoolInfo.liquidity.isZero()) continue;
    await cache.setItem(whirlpoolInfo.pubkey.toString(), whirlpoolInfo, {
      prefix: whirlpoolPrefix,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-whirlpools`,
  executor,
};
export default job;
