import { Connection, ParsedTransactionWithMeta } from '@solana/web3.js';

export const getTransactions = (
  connection: Connection,
  signatures: string[]
): Promise<(ParsedTransactionWithMeta | null)[]> =>
  connection.getParsedTransactions(signatures, {
    maxSupportedTransactionVersion: 0,
  });
