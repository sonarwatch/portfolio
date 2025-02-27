import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Connection } from '@solana/web3.js';

import { Agent } from 'node:http';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';
import { getRpcEndpoint } from './constants';
import { SolanaClient } from './types';
import sleep from '../misc/sleep';

const agent = new Agent({
  maxSockets: 100,
});

const axiosObject = axios.create({
  httpsAgent: agent,
});

async function axiosFetchWithRetries(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
  retryAttempts = 0
): Promise<Response> {
  let attempt = 0;
  let fInit: RequestInit | undefined = init;

  // Adding default headers
  if (!fInit || !fInit.headers) {
    fInit = {
      ...fInit,
      headers: {
        'Content-Type': 'application/json',
        ...fInit?.headers,
      },
    };
  }
  // console.log(' fInit:', fInit);

  while (attempt < retryAttempts) {
    try {
      const axiosHeaders: Record<string, string> = {};
      new Headers(fInit.headers).forEach((value, key) => {
        axiosHeaders[key] = value;
      });

      const axiosConfig = {
        data: fInit.body,
        headers: axiosHeaders,
        method: fInit.method,
        baseURL: input.toString(),
        validateStatus: () => true,
      };

      const axiosResponse = await axiosObject.request(axiosConfig);

      const { data, status, statusText, headers } = axiosResponse;

      // Mapping headers from axios to fetch format
      const headersArray: [string, string][] = Object.entries(headers).map(
        ([key, value]) => [key, value]
      );

      const fetchHeaders = new Headers(headersArray);

      const response = new Response(JSON.stringify(data), {
        status,
        statusText,
        headers: fetchHeaders,
      });

      // Comment the above lines and uncomment the following one to switch from axios to fetch
      // const response = await fetch(input, init);

      // Traffic might get routed to backups or node restarts or if anything throws a 502, retry
      if (response.status === 502) {
        attempt += 1;
        await sleep(100 * attempt);
        continue;
      }
      return await Promise.resolve(response);
    } catch (e) {
      attempt += 1;
      continue;
    }
  }

  return Promise.reject(new Error(`Max retries reached: ${retryAttempts}`));
}

export default function getClientSolanaAlt(): SolanaClient {
  const rpcEndpoint = getRpcEndpoint(NetworkId.solana);
  const httpHeaders = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
    : undefined;

  return new Connection(rpcEndpoint.url, {
    httpHeaders,
    async fetch(input, init?) {
      return axiosFetchWithRetries(input, init, 5);
    },
  });
}
