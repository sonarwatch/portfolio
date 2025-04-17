import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, poolsProgramId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
} from '../../../utils/solana';
import { PoolState, poolStateStruct, poolStateV2Struct } from '../struct';
import {
  constantPoolsFilters,
  memePoolsFilters,
  stablePoolsFilters,
} from '../filters';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getLpTokenPricesFromPoolsStates } from '../helpers';

const poolsConfigs = [
  {
    pid: poolsProgramId,
    struct: poolStateStruct,
    filter: constantPoolsFilters,
  },
  {
    pid: poolsProgramId,
    struct: poolStateStruct,
    filter: stablePoolsFilters,
  },
  {
    pid: poolsProgramId,
    struct: poolStateV2Struct,
    filter: memePoolsFilters,
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const step = 100;

  const sources: TokenPriceSource[] = [];
  let poolsPubKeys: PublicKey[];
  let poolsAccounts: (ParsedAccount<PoolState> | null)[];
  for (const poolConfig of poolsConfigs) {
    poolsPubKeys = (
      await client.getProgramAccounts(poolConfig.pid, {
        filters: [...poolConfig.filter],
        dataSlice: { length: 0, offset: 0 },
      })
    ).map((acc) => acc.pubkey);

    for (let offset = 0; offset < poolsPubKeys.length; offset += step) {
      poolsAccounts = await getParsedMultipleAccountsInfo(
        client,
        poolConfig.struct,
        poolsPubKeys.slice(offset, offset + step).map((key) => key)
      );

      const lpSources = await getLpTokenPricesFromPoolsStates(
        client,
        cache,
        poolsAccounts
      );
      sources.push(...lpSources);
    }
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
