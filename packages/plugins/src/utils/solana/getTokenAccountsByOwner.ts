import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';
import { getParsedProgramAccounts } from './getParsedProgramAccounts';
import { tokenAccountStruct } from './structs';
import { solanaTokenPid } from './constants';

export async function getTokenAccountsByOwner(
  connection: Connection,
  owner: PublicKey,
  tokenProgramId: PublicKey = solanaTokenPid
) {
  const filters: GetProgramAccountsFilter[] = [
    {
      memcmp: {
        bytes: owner.toString(),
        offset: 32,
      },
    },
  ];
  if (tokenProgramId.toString() === solanaTokenPid.toString()) {
    filters.push({ dataSize: tokenAccountStruct.byteSize });
  }

  return getParsedProgramAccounts(
    connection,
    tokenAccountStruct,
    tokenProgramId,
    filters,
    10000
  );
}
