import { Connection } from '@solana/web3.js';
import { promiseTimeout, Transaction } from '@sonarwatch/portfolio-core';
import { getTransactions } from './getTransactions';
import { parseTransaction } from './parseTransaction';

const DEFAULT_TIMEOUT = 60000;

async function iRunTx(
  connection: Connection,
  owner: string,
  signature: string
) {
  const txs = await getTransactions(connection, [signature]);
  return txs.map((t) => parseTransaction(t, owner))[0];
}

export async function runTx(
  connection: Connection,
  signature: string,
  owner: string,
  timeoutMs?: number
): Promise<Transaction | null> {
  return promiseTimeout(
    iRunTx(connection, signature, owner),
    timeoutMs || DEFAULT_TIMEOUT,
    `Activity timed out`
  );
}
