import { Connection } from '@solana/web3.js';
import {
  NetworkId,
  promiseTimeout,
  Transaction,
  TransactionsResult,
} from '@sonarwatch/portfolio-core';
import { getSignatures } from './getSignatures';
import { getTransactions } from './getTransactions';
import { parseTransaction } from './parseTransaction';

const DEFAULT_TIMEOUT = 60000;

async function iRun(connection: Connection, owner: string, account?: string) {
  const startDate = Date.now();

  const signatures = await getSignatures(connection, account || owner);
  const txs = await getTransactions(
    connection,
    signatures.map((s) => s.signature)
  );
  const parsedTxs = txs.map((t) => parseTransaction(t, owner));
  const now = Date.now();
  const result: TransactionsResult = {
    owner,
    account: account || owner,
    duration: now - startDate,
    networkId: NetworkId.solana,
    transactions: parsedTxs.filter((t) => t !== null) as Transaction[],
  };
  return result;
}

export async function run(
  connection: Connection,
  owner: string,
  account?: string,
  timeoutMs?: number
): Promise<TransactionsResult> {
  return promiseTimeout(
    iRun(connection, owner, account),
    timeoutMs || DEFAULT_TIMEOUT,
    `Activity timed out`
  );
}
