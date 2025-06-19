import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { platformId, poolsProgramId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { ParsedAccount } from '../../../utils/solana';
import { PoolState, poolStateStruct } from '../struct';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getLpTokenPricesFromPoolsStates } from '../helpers';
import { getParsedMultipleAccountsInfoSafe } from '../../../utils/solana/getParsedMultipleAccountsInfoSafe';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const step = 100;

  const sources: TokenPriceSource[] = [];

  const poolsPubKeys = (
    await client.getProgramAccounts(poolsProgramId, {
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: 'hQrXeCntzbV',
          },
        },
      ],
      dataSlice: { length: 0, offset: 0 },
    })
  ).map((acc) => acc.pubkey);

  let poolsAccounts: (ParsedAccount<PoolState> | null)[];

  for (let offset = 0; offset < poolsPubKeys.length; offset += step) {
    poolsAccounts = await getParsedMultipleAccountsInfoSafe(
      client,
      poolStateStruct,
      poolStateStruct.byteSize,
      poolsPubKeys.slice(offset, offset + step).map((key) => key)
    );

    const lpSources = await getLpTokenPricesFromPoolsStates(
      client,
      cache,
      poolsAccounts
    );
    sources.push(...lpSources);
  }

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
