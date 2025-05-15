import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  cachePrefix,
  platformId,
  sharkyProgram,
  tokensOrderBooksCacheKey,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { tokenLendingOrderBookStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const [orderBooks] = await Promise.all([
    ParsedGpa.build(connection, tokenLendingOrderBookStruct, sharkyProgram)
      .addFilter('accountDiscriminator', [192, 71, 92, 163, 99, 85, 39, 27])
      .run(),
  ]);

  if (!orderBooks) return;

  await cache.setItem(tokensOrderBooksCacheKey, orderBooks, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-tokens-orderbook`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
