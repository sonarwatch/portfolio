import { NetworkId } from '@sonarwatch/portfolio-core';
import { SuiClient, SuiHTTPTransport } from '@mysten/sui.js/dist/cjs/client';
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
  return new SuiClient({
    transport: new SuiHTTPTransport({
      url: rpcEndpoint.url,
      rpc: {
        headers: {
          ...httpHeaders,
        },
      },
    }),
  });
}
