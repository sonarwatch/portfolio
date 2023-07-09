import { NetworkId } from '@sonarwatch/portfolio-core';
import { AptosClient } from 'aptos';
import { rpcEnpoints } from './constants';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';

export default function getClientAptos() {
  const rpcEndpoint = rpcEnpoints[NetworkId.aptos];
  const headers = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth?.username,
        rpcEndpoint.basicAuth?.password
      )
    : undefined;
  return new AptosClient(rpcEndpoint.url, {
    HEADERS: headers,
  });
}
