import Web3 from 'web3-v1';
import DSA, { ChainId } from 'dsa-connect';
import {
  EvmNetworkIdType,
  RpcEndpoint,
  networks,
} from '@sonarwatch/portfolio-core';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';

export function getDSA(networkId: EvmNetworkIdType, rpcEndpoint: RpcEndpoint) {
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

  const network = networks[networkId];

  return new DSA(
    {
      web3: new Web3(
        new Web3.providers.HttpProvider(rpcEndpoint.url, {
          headers: httpHeaders,
        })
      ),
    },
    network.chainId as ChainId
  );
}
