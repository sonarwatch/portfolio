import {
  Connection,
  GetProgramAccountsConfig,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';
import { withTiming } from '../performance/timing';

export const MAX_TIME_MS_EXECUTION_TO_LOG = 1;

export async function getProgramAccounts(
  connection: Connection,
  programId: PublicKey,
  filters?: GetProgramAccountsFilter[],
  maxAccounts = 0
) {
  return withTiming(
    `[All] getProgramAccounts ${programId.toString()}`,
    async () => {
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
