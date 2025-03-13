import {
  NetworkIdType,
  NetworkId,
  Transaction,
  TransactionsResult,
  Service,
  promiseTimeout,
} from '@sonarwatch/portfolio-core';
import { Connection } from '@solana/web3.js';
import { getSignatures } from './utils/solana/getSignatures';
import { getTransactions } from './utils/solana/getTransactions';
import { parseTransaction } from './utils/solana/parseTransaction';

import * as defituna from './services/defituna';
import * as drift from './services/drift';
import * as driftMMV from './services/drift-market-maker-vault';
import * as jupiter from './services/jupiter';
import * as kamino from './services/kamino';
import * as meteora from './services/meteora';
import * as orca from './services/orca';
import * as raydium from './services/raydium';

export const services: Service[] = [
  defituna,
  drift,
  driftMMV,
  jupiter,
  kamino,
  meteora,
  orca,
  raydium,
]
  .map((m) => m.default)
  .flat();
export * from './utils/solana/parseTransaction';
export * from './utils/solana/getSignatures';
export * from './utils/solana/getTransactions';

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
