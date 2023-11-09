import { Connection, PublicKey } from '@solana/web3.js';
import { GlobalBeetStruct, ParsedAccount } from './types';

export async function getParsedAccountInfo<T>(
  connection: Connection,
  beetStruct: GlobalBeetStruct<T>,
  publicKey: PublicKey
): Promise<ParsedAccount<T> | null> {
  const accountInfo = await connection.getAccountInfo(publicKey);
  if (accountInfo === null) return null;
  return {
    pubkey: publicKey,
    lamports: accountInfo.lamports,
    ...beetStruct.deserialize(accountInfo.data)[0],
  } as ParsedAccount<T>;
}
