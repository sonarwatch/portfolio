import { PublicKey } from '@solana/web3.js';
import { Cache, Job, JobExecutor } from '@sonarwatch/portfolio-plugins';
import { CACHE_CONFIG, platformId, ProgramCacheCategory } from './constants';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../utils/clients';
import { getProgramAccounts, programCachePrefix } from '../../utils/solana';
import { compress } from '../../utils/compression/compression';

function getProgramCacheJob(
  programCategory: ProgramCacheCategory,
  programs: string[]
): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    const cacheType = process.env['PROGRAMS_CACHE_LEVEL'];
    if (cacheType !== 'REDIS' && cacheType !== 'MEMORY') {
      console.log(`Job should be skipped. ProgramCacheType=${cacheType}`);
      return;
    }

    const client = getClientSolana();
    const config = CACHE_CONFIG[programCategory];

    for (const program of programs) {
      try {
        const key = new PublicKey(program);
        await cache.removeItem(program, {
          networkId: NetworkId.solana,
          prefix: programCachePrefix,
        });
        const dataToCache = await getProgramAccounts(client, key);
        console.log(`Program ${program} size is ${dataToCache.length}`);

        if (dataToCache.length > config.maxAccounts) {
          console.log(
            `Too many accounts for program. Program=${program} Count=${dataToCache.length}`
          );
          continue;
        }

        const compressedData = await compress(dataToCache);
        await cache.setItem(program, compressedData, {
          networkId: NetworkId.solana,
          prefix: programCachePrefix,
          ttl: config.ttlHours * 60 * 60 * 1000,
        });
      } catch (err) {
        console.error(
          `Failed to get program accounts. Program=${program}`,
          err
        );
      }
    }
  };
  return {
    id: `${platformId}-cache-${programCategory.toLowerCase()}`,
    networkIds: [NetworkId.solana],
    executor,
    labels: ['normal', NetworkId.solana],
  };
}

export default getProgramCacheJob;
