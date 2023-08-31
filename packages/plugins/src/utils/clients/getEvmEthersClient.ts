import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { EvmNetworkIdType, networks } from '@sonarwatch/portfolio-core';
import { getRpcEndpoint } from './constants';

export default function getEvmEthersClient(
  networkId: EvmNetworkIdType
): StaticJsonRpcProvider {
  const rpcEndpoint = getRpcEndpoint(networkId);
  const user = rpcEndpoint.basicAuth?.username;
  const password = rpcEndpoint.basicAuth?.password;
  return new StaticJsonRpcProvider(
    {
      url: rpcEndpoint.url,
      user,
      password,
    },
    networks[networkId].chainId
  );
}
