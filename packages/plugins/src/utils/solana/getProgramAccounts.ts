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

export const MAX_TIME_MS_EXECUTION_TO_LOG = 15 * 1000;
export const MAX_TIME_FILTERING_TO_LOG = 1;

export async function getProgramAccounts(
  connection: Connection,
  programId: PublicKey,
  filters?: GetProgramAccountsFilter[],
  maxAccounts = 0
) {
  return withTiming(`getProgramAccounts ${programId.toString()}`, async () => {
    const cachedAccounts: any[] | undefined = await withTiming(`RedisLoading. ${programId.toString()}`, async () => getCache().getItem(
      `${programId.toString()}`,
      {
        networkId: NetworkId.solana,
        prefix: programCachePrefix,
      }
    ), MAX_TIME_FILTERING_TO_LOG);

    if (cachedAccounts?.length) {
      console.log(
        `Program Accounts are loaded from cache for program ${programId}`
      );

      const optimizedResult = await withTiming(`OptimizedFilter. ${programId.toString()}`, async () => {
        const preprocessedFilters = filters?.map((filter) => {
          if ('memcmp' in filter) {
            return {
              ...filter,
              memcmp: {
                ...filter.memcmp,
                decodedBytes: bs58.decode(filter.memcmp.bytes),
              },
            };
          }
          return filter;
        });

        const testResult: any[] = [];
        for (const acc of cachedAccounts) {
          const dataBuffer = Buffer.from(acc.account.data.data);

          const matches = preprocessedFilters?.every((filter) => {
            if ('dataSize' in filter) {
              return dataBuffer.length === filter.dataSize;
            }

            if ('memcmp' in filter) {
              const { offset, decodedBytes } = filter.memcmp;
              const segment = dataBuffer.subarray(
                offset,
                offset + decodedBytes.length
              );
              return segment.equals(decodedBytes);
            }

            return true;
          });

          if (matches) {
            testResult.push({
              pubkey: new PublicKey(acc.pubkey),
              account: {
                data: dataBuffer,
                executable: acc.account.executable,
                lamports: acc.account.lamports,
                owner: new PublicKey(acc.account.owner),
                rentEpoch: acc.account.rentEpoch,
                space: acc.account.space,
              },
            });
          }
        }
        return testResult;
      });

      const result = await withTiming(`NotOptimizedFilter. ${programId.toString()}`, async () => cachedAccounts
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
        })), MAX_TIME_FILTERING_TO_LOG);

      console.log(`FilteringResults. Optimized=${optimizedResult.length} Old=${result.length}`)
      return result;
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
  }, MAX_TIME_MS_EXECUTION_TO_LOG);
}
