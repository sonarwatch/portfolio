import { Connection, PublicKey } from '@solana/web3.js';

const MAX_ACCOUNT = 100;

export async function getMultipleAccountsInfoSafe(
  connection: Connection,
  publicKeys: PublicKey[]
) {
  if (publicKeys.length <= MAX_ACCOUNT) {
    return connection.getMultipleAccountsInfo(publicKeys);
  }
  const accountsInfo = [];
  const publicKeysToFetch = [...publicKeys];
  while (publicKeysToFetch.length !== 0) {
    const currPublicKeysToFetch = publicKeysToFetch.splice(0, MAX_ACCOUNT);
    const accountsInfoRes = await connection.getMultipleAccountsInfo(
      currPublicKeysToFetch
    );
    accountsInfo.push(...accountsInfoRes);
  }
  return accountsInfo;
}
