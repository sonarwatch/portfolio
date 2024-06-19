import {
  Commitment,
  Connection,
  GetMultipleAccountsConfig,
  PublicKey,
} from '@solana/web3.js';

const MAX_ACCOUNT = 100;

export async function getMultipleAccountsInfoSafe(
  connection: Connection,
  publicKeys: PublicKey[],
  commitmentOrConfig?: Commitment | GetMultipleAccountsConfig
) {
  if (publicKeys.length <= MAX_ACCOUNT) {
    return connection.getMultipleAccountsInfo(publicKeys, commitmentOrConfig);
  }
  const accountsInfo = [];
  const publicKeysToFetch = [...publicKeys];
  while (publicKeysToFetch.length !== 0) {
    const currPublicKeysToFetch = publicKeysToFetch.splice(0, MAX_ACCOUNT);
    const accountsInfoRes = await connection.getMultipleAccountsInfo(
      currPublicKeysToFetch,
      commitmentOrConfig
    );
    accountsInfo.push(...accountsInfoRes);
  }
  return accountsInfo;
}
