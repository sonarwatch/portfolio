import { NetworkId } from '@sonarwatch/portfolio-core';
import { AptosClient } from 'aptos';
import { rpcEnpoints } from './constants';

export default function getClientAptos() {
  const rpcEndpoint = rpcEnpoints[NetworkId.aptos];
  console.log('rpcEndpoint:', rpcEndpoint);
  return new AptosClient(rpcEndpoint.url, {
    USERNAME: rpcEndpoint.basicAuth?.username,
    PASSWORD: rpcEndpoint.basicAuth?.password,
  });
}
