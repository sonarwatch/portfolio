import TTLCache from '@isaacs/ttlcache';
import {
  Connection,
  GetProgramAccountsConfig,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';
import bs58 from 'bs58';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { programCachePrefix } from './constants';
import { getCache } from '../../Cache';
import { withTiming } from '../performance/timing';
import { decompress } from '../compression/compression';

const programsCache = new TTLCache<string, any[]>({ max: 200, ttl: 600_000 });

export const MAX_TIME_MS_EXECUTION_TO_LOG = 15_000;
export const MAX_TIME_FILTERING_TO_LOG = 1;

export async function getProgramAccounts(
  connection: Connection,
  programId: PublicKey,
  filters?: GetProgramAccountsFilter[],
  maxAccounts = 0
) {
  return withTiming(
    `getProgramAccounts ${programId.toString()}`,
    async () => {
      try {
        const programIdStr = programId.toString();
        const cachedAccounts: any[] | undefined = await loadFromCache(
          programIdStr
        );
        console.log(`Cache size. Size=${programsCache.size}`);

        if (cachedAccounts) {
          console.log(
            `Program Accounts are loaded from cache for program ${programId}`
          );

          return cachedAccounts
            .filter(({ account }) => {
              const data = Buffer.from(account.data.data);
              return filters?.every((filter) => {
                if ('dataSize' in filter) {
                  return data.length === filter['dataSize'];
                }
                if ('memcmp' in filter) {
                  const bytes = bs58.decode(filter['memcmp'].bytes);
                  const segment = data.subarray(
                    filter['memcmp'].offset,
                    filter['memcmp'].offset + bytes.length
                  );

                  return segment.equals(bytes);
                }
                return true;
              });
            })
            .map((account) => ({
              pubkey: new PublicKey(account.pubkey),
              account: {
                data: Buffer.from(account.account.data.data),
                executable: account.account.executable,
                lamports: account.account.lamports,
                owner: new PublicKey(account.account.owner),
                rentEpoch: account.account.rentEpoch,
                space: account.account.space,
              },
            }));
        }
      } catch (err) {
        console.error(
          `Failed to extract cached data for ${programId.toString()}`,
          err
        );
      }

      const config: GetProgramAccountsConfig = {
        encoding: 'base64',
        filters,
      };

      if (maxAccounts <= 0) {
        return connection.getProgramAccounts(programId, config);
      }

      const accountsRes = await connection.getProgramAccounts(programId, {
        ...config,
        dataSlice: { offset: 0, length: 0 },
      });

      if (accountsRes.length > maxAccounts)
        throw new Error(`Too much accounts to get (${accountsRes.length})`);

      return connection.getProgramAccounts(programId, config);
    },
    MAX_TIME_MS_EXECUTION_TO_LOG
  );
}

export async function loadFromCache(key: string): Promise<any[] | undefined> {
  const cachedInMemory: any[] | undefined = programsCache.get(key);
  if (cachedInMemory) {
    console.log(
      `[MEMORY] hit: ${key} ItemsCount: ${cachedInMemory.length}`
    );
    return cachedInMemory;
  }

  console.log(`[MEMORY] miss: ${key}, loading from Redis...`);
  const cachedInRedis: string | undefined = await withTiming(
    `RedisLoading. ${key}`,
    async () =>
      getCache().getItem(key, {
        prefix: programCachePrefix,
        networkId: NetworkId.solana,
      }),
    MAX_TIME_FILTERING_TO_LOG
  );

  if (cachedInRedis) {
    const cachedAccounts: any[] = await decompress(cachedInRedis);
    programsCache.set(key, cachedAccounts);
    console.log(
      `[REDIS] loaded and saved to memory: ${key} Size: ${
        cachedInRedis.length / 1024 / 1024
      } Mb`
    );
    return cachedAccounts;
  }

  console.log(`[REDIS] miss: ${key}`);
  return undefined;
}
