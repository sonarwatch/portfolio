import { seiprotocol } from '@sei-js/proto';

import { NetworkId } from '@sonarwatch/portfolio-core';
import { AptosClient } from 'aptos';
import { getRpcEndpoint, getUrlEndpoint } from './constants';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';

export default function getClientSei() {
  const urlEndpoint = getUrlEndpoint(NetworkId.sei);
  return seiprotocol.ClientFactory.createLCDClient({
    restEndpoint: urlEndpoint,
  });
}

export function getClientAptos() {
  const rpcEndpoint = getRpcEndpoint(NetworkId.aptos);
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
