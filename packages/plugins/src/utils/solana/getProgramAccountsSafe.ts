import {
  Connection,
  GetProgramAccountsConfig,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';

export async function getProgramAccountsSafe(
  connection: Connection,
  maxAccounts: number,
  programId: PublicKey,
  filters: GetProgramAccountsFilter[] | undefined = undefined
) {
  const config: GetProgramAccountsConfig = {
    commitment: 'confirmed',
    encoding: 'base64',
    filters,
  };

  if (maxAccounts < 0) return connection.getProgramAccounts(programId, config);

  const accountsRes = await connection.getProgramAccounts(programId, {
    ...config,
    dataSlice: { offset: 0, length: 0 },
  });
  if (accountsRes.length > maxAccounts) throw new Error('Too much accounts to get');

  return connection.getProgramAccounts(programId, config);
}
