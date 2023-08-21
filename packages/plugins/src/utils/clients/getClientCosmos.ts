import { cosmos } from 'osmojs';

export default function getClientCosmos() {
  return cosmos.ClientFactory.createRPCQueryClient({
    rpcEndpoint: 'https://cosmos-rpc.polkachu.com/',
  });
}
