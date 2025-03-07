import { Connection, ParsedTransactionWithMeta } from '@solana/web3.js';

export const getTransactions = (
  client: Connection,
  signatures: string[]
): Promise<(ParsedTransactionWithMeta | null)[]> =>
  client.getParsedTransactions(signatures, {
    maxSupportedTransactionVersion: 0,
  });
