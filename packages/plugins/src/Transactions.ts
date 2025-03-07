import {
  NetworkIdType,
  NetworkId,
  Transaction,
  TransactionsResult,
} from '@sonarwatch/portfolio-core';
import { Cache } from './Cache';
import promiseTimeout from './utils/misc/promiseTimeout';
import { getClientSolana } from './utils/clients';
import { services } from './index';
import { getSignatures } from './utils/solana/transactions/getSignatures';
import { getTransactions } from './utils/solana/transactions/getTransactions';
import { parseTransaction } from './utils/solana/transactions/parseTransaction';

const runActivityTimeout = 60000;

export async function runTransactions(
  cache: Cache,
  network: NetworkIdType,
  owner: string,
  account?: string
): Promise<TransactionsResult> {
  if (network !== NetworkId.solana) {
    throw new Error(`Unsupported Network ${network}`);
  }
  const client = getClientSolana();

  const sortedServices = services.sort(
    (a, b) => (b.contracts?.length || 0) - (a.contracts?.length || 0)
  );

  const startDate = Date.now();

  const activityPromise = getSignatures(client, account || owner)
    .then((signatures) =>
      getTransactions(
        client,
        signatures.map((s) => s.signature)
      )
    )
    .then((parsedTransactions) =>
      parsedTransactions.map((t) => parseTransaction(t, owner, sortedServices))
    )
    .then((txns) => {
      const now = Date.now();
      return {
        owner,
        account: account || owner,
        networkId: network,
        duration: now - startDate,
        transactions: txns.filter((t) => t !== null) as Transaction[],
      };
    });

  return promiseTimeout(
    activityPromise,
    runActivityTimeout,
    `Activity timed out`
  );
}
