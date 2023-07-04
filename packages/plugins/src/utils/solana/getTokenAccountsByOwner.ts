import { Connection, PublicKey } from '@solana/web3.js';
import { getParsedProgramAccounts } from './getParsedProgramAccounts';
import { tokenAccountStruct } from './structs';
import { solanaTokenPid } from './constants';

export async function getTokenAccountsByOwner(connection: Connection, owner: PublicKey) {
  return getParsedProgramAccounts(
    connection,
    tokenAccountStruct,
    solanaTokenPid,
    [
      {
        memcmp: {
          bytes: owner.toString(),
          offset: 32,
        },
      },
      { dataSize: tokenAccountStruct.byteSize },
    ],
    10000
  );
}
