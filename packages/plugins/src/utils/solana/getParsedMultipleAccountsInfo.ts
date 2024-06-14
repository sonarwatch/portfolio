import {
  Commitment,
  Connection,
  GetMultipleAccountsConfig,
  PublicKey,
} from '@solana/web3.js';
import { getMultipleAccountsInfoSafe } from './getMultipleAccountsInfoSafe';
import { GlobalBeetStruct, ParsedAccount } from './types';

export async function getParsedMultipleAccountsInfo<T>(
  connection: Connection,
  beetStruct: GlobalBeetStruct<T>,
  publicKeys: PublicKey[],
  commitmentOrConfig?: Commitment | GetMultipleAccountsConfig
): Promise<(ParsedAccount<T> | null)[]> {
  const accountsInfo = await getMultipleAccountsInfoSafe(
    connection,
    publicKeys,
    commitmentOrConfig
  );
  return accountsInfo.map((accountInfo, i) =>
    accountInfo
      ? ({
          pubkey: publicKeys[i],
          ...beetStruct.deserialize(accountInfo.data)[0],
        } as ParsedAccount<T>)
      : null
  );
}
