import { PublicKey } from '@solana/web3.js';
import { Cache, Job, JobExecutor } from '@sonarwatch/portfolio-plugins';
import {
  CACHE_CONFIG,
  platformId,
  ProgramCacheCategory,
  programs,
} from './constants';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../utils/clients';
import { getProgramAccounts, programCachePrefix } from '../../utils/solana';
import { classifyProgram } from './helpers';
import { compress } from '../../utils/compression/compression';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  for (const program of programs) {
    const key = new PublicKey(program);
    await cache.removeItem(program, {
      networkId: NetworkId.solana,
      prefix: programCachePrefix,
    });

    try {
      const dataToCache = await getProgramAccounts(client, key);
      const programCategory = classifyProgram(dataToCache.length);
      if (programCategory === ProgramCacheCategory.DENY) {
        console.log(
          `Too many accounts for program. Program=${program} Count=${dataToCache.length}`
        );
        continue;
      }

      const config = CACHE_CONFIG[programCategory];
      const compressedData = await compress(dataToCache);
      await cache.setItem(program, compressedData, {
        networkId: NetworkId.solana,
        prefix: programCachePrefix,
        ttl: config.ttlHours * 60 * 60 * 1000,
      });
    } catch (err) {
      console.error(`Failed to get program accounts. Program=${program}`, err);
    }
  }
};

const job: Job = {
  id: `${platformId}-cache`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
