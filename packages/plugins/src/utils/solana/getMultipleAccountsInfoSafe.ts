import {
  Commitment,
  Connection,
  GetMultipleAccountsConfig,
  PublicKey,
} from '@solana/web3.js';

const MAX_ACCOUNT = 100;

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function getMultipleAccountsInfoSafe(
  connection: Connection,
  publicKeys: PublicKey[],
  commitmentOrConfig?: Commitment | GetMultipleAccountsConfig
) {
  if (publicKeys.length <= MAX_ACCOUNT) {
    return connection.getMultipleAccountsInfo(publicKeys, commitmentOrConfig);
  }

  const chunks = chunkArray(publicKeys, MAX_ACCOUNT);

  const results = await Promise.all(
    chunks.map(chunk =>
      connection.getMultipleAccountsInfo(chunk, commitmentOrConfig)
    )
  );

  return results.flat();
}
