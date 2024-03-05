import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { klendProgramId, marketsKey, platformId } from './constants';
import { lendingMarketStruct } from './structs/klend';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const lendingMarketAccounts = await getParsedProgramAccounts(
    client,
    lendingMarketStruct,
    klendProgramId,
    dataSizeFilter(lendingMarketStruct.byteSize)
  );

  await cache.setItem(
    marketsKey,
    lendingMarketAccounts.map((acc) => acc.pubkey.toString()),
    { prefix: platformId, networkId: NetworkId.solana }
  );
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
  label: 'normal',
};
export default job;
