import { seiprotocol } from '@sei-js/proto';

export default function getClientCosmos() {
  return seiprotocol.ClientFactory.createRPCQueryClient({
    rpcEndpoint: 'https://cosmos-rpc.polkachu.com/',
  });
}
