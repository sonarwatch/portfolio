import { Connection } from '@solana/web3.js';
import {
  NetworkId,
  promiseTimeout,
  TransactionsResult,
} from '@sonarwatch/portfolio-core';
import { getSignatures } from './getSignatures';
import { getTransactions } from './getTransactions';
import { parseTransaction } from './parseTransaction';

const runActivityTimeout = 60000;

export async function run(
  connection: Connection,
  owner: string,
  account?: string
): Promise<TransactionsResult> {
  const startDate = Date.now();

  const activityPromise = getSignatures(connection, account || owner)
    .then((signatures) =>
      getTransactions(
        connection,
        signatures.map((s) => s.signature)
      )
    )
    .then((parsedTransactions) =>
      parsedTransactions.map((t) => parseTransaction(t, owner))
    )
    .then((txns): TransactionsResult => {
      const now = Date.now();
      return {
        owner,
        account: account || owner,
        duration: now - startDate,
        networkId: NetworkId.solana,
        transactions: txns.filter((t) => t !== null),
      };
    });

  return promiseTimeout(
    activityPromise,
    runActivityTimeout,
    `Activity timed out`
  );
}
