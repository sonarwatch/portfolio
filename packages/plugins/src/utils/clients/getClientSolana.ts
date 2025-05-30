import { NetworkId } from '@sonarwatch/portfolio-core';
import { Connection, FetchMiddleware, Commitment } from '@solana/web3.js';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';
import { getRpcEndpoint } from './constants';
import { SolanaClient } from './types';

export type SolanaClientParams = {
  commitment?: Commitment;
};

const reqs: Record<string, Record<string, number>> = {
  all: {
    total: 0,
  },
};

export default function getClientSolana(
  params?: SolanaClientParams
): SolanaClient {
  const rpcEndpoint = getRpcEndpoint(NetworkId.solana);
  const httpHeaders = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
    : undefined;

  let fetchMiddleware: FetchMiddleware | undefined;
  if (process.env['PORTFOLIO_RPC_LOGS'] === 'true') {
    fetchMiddleware = (info, init, fetch) => {
      const { method } = JSON.parse(init?.body?.toString() || '{}');
      if (typeof method !== 'string') {
        return;
      }
      if (!reqs['all'][method]) {
        reqs['all'][method] = 0;
      }
      reqs['all'][method] += 1;
      reqs['all']['total'] += 1;

      if (typeof info === 'string') {
        if (!reqs[info]) {
          reqs[info] = { total: 0 };
        }
        if (!reqs[info][method]) {
          reqs[info][method] = 0;
        }
        reqs[info][method] += 1;
        reqs[info]['total'] += 1;
      }

      if (reqs['all']['total'] % 5 === 1) {
        // eslint-disable-next-line no-console
        console.log(`RPC Requests: ${JSON.stringify(reqs, undefined, 2)}`);
      }
      fetch(info, init);
    };
  }

  return new Connection(rpcEndpoint.url, {
    commitment: params?.commitment || 'confirmed',
    httpHeaders,
    fetchMiddleware,
  });
}
