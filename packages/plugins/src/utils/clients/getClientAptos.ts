import { NetworkId } from '@sonarwatch/portfolio-core';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { getRpcEndpoint } from './constants';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';
import { AptosClient } from './types';

export default function getClientAptos(): AptosClient {
  const rpcEndpoint = getRpcEndpoint(NetworkId.aptos);
  const headers = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth?.username,
        rpcEndpoint.basicAuth?.password
      )
    : undefined;
  const config = new AptosConfig({
    network: Network.MAINNET,
    clientConfig: {
      HEADERS: headers,
    },
    fullnode: rpcEndpoint.url,
  });
  return new Aptos(config);
}
