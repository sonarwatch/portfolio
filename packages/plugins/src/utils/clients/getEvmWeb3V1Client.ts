import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import Web3 from 'web3-v1';
import { getRpcEndpoint } from './constants';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';

export default function getEvmWeb3V1Client(networkId: EvmNetworkIdType) {
  const rpcEndpoint = getRpcEndpoint(networkId);
  const authHeaders = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
    : undefined;
  const httpHeaders = authHeaders
    ? [
        {
          name: 'Authorization',
          value: authHeaders.Authorization,
        },
      ]
    : undefined;
  return new Web3(
    new Web3.providers.HttpProvider(rpcEndpoint.url, {
      headers: httpHeaders,
    })
  );
}
