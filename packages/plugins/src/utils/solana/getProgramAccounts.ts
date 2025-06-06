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

export async function getProgramAccounts(
  connection: Connection,
  programId: PublicKey,
  filters?: GetProgramAccountsFilter[],
  maxAccounts = 0
) {
  return withTiming(`getProgramAccounts ${programId.toString()}`, async () => {
    const cachedAccounts: any[] | undefined = await getCache().getItem(
      `${programId.toString()}`,
      {
        networkId: NetworkId.solana,
        prefix: programCachePrefix,
      }
    );

    if (cachedAccounts?.length) {
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
