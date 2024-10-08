import {
  SuiClient as MystenSuiClient,
  SuiHTTPTransport,
} from '@mysten/sui/client';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';
import { getRpcEndpoint } from './constants';
import { SuiClient } from './types';

export default function getClientSui(): SuiClient {
  const rpcEndpoint = getRpcEndpoint(NetworkId.sui);
  const httpHeaders = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
    : undefined;

  return new MystenSuiClient({
    transport: new SuiHTTPTransport({
      url: rpcEndpoint.url,
      rpc: {
        headers: httpHeaders,
      },
    }),
  });
}
