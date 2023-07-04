import { NetworkId } from '@sonarwatch/portfolio-core';
import { Connection } from '@solana/web3.js';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';
import { rpcEnpoints } from './constants';

export default function getClientSolana() {
  const rpcEndpoint = rpcEnpoints[NetworkId.aptos];
  const httpHeaders = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
    : undefined;
  return new Connection(rpcEndpoint.url, {
    httpHeaders,
  });
}
