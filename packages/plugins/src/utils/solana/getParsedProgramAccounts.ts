import { Connection, GetProgramAccountsFilter, PublicKey } from '@solana/web3.js';
import { getProgramAccountsSafe } from './getProgramAccountsSafe';
import { GlobalBeetStruct, ParsedAccount } from './types';

export async function getParsedProgramAccounts<T>(
  connection: Connection,
  beetStruct: GlobalBeetStruct<T>,
  programId: PublicKey,
  filters: GetProgramAccountsFilter[] | undefined = undefined,
  maxAccounts = -1
) {
  const accountsRes = await getProgramAccountsSafe(
    connection,
    maxAccounts,
    programId,
    filters
  );
  return accountsRes.map(
    (accountRes) =>
      ({
        pubkey: accountRes.pubkey,
        lamports: accountRes.account.lamports,
        ...beetStruct.deserialize(accountRes.account.data)[0],
      } as ParsedAccount<T>)
  );
}
