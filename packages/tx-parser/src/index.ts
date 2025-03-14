import {
  NetworkIdType,
  NetworkId,
  Transaction,
  TransactionsResult,
  promiseTimeout,
} from '@sonarwatch/portfolio-core';
import { Connection } from '@solana/web3.js';
import { getSignatures } from './utils/solana/getSignatures';
import { getTransactions } from './utils/solana/getTransactions';
import { parseTransaction } from './utils/solana/parseTransaction';

export * from './utils/solana/parseTransaction';
export * from './utils/solana/getSignatures';
export * from './utils/solana/getTransactions';
export { services } from './services';

const runActivityTimeout = 60000;

export async function run(
  network: NetworkIdType,
  owner: string,
  account?: string
): Promise<TransactionsResult> {
  if (network !== NetworkId.solana) {
    throw new Error(`Unsupported Network ${network}`);
  }
  const client = new Connection(
    process.env['PORTFOLIO_SOLANA_RPC'] ||
      'https://api.mainnet-beta.solana.com',
    {
      commitment: 'confirmed',
    }
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
      parsedTransactions.map((t) => parseTransaction(t, owner))
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
