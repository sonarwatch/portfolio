import { JsonRpcClient, JsonRpcProvider } from '@mysten/sui.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';
import { getRpcEndpoint } from './constants';

export default function getClientSui() {
  const rpcEndpoint = getRpcEndpoint(NetworkId.sui);
  const httpHeaders = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
    : undefined;
  return new JsonRpcProvider(undefined, {
    rpcClient: new JsonRpcClient(rpcEndpoint.url, httpHeaders),
  });
}
