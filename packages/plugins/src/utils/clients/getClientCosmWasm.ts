import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { CosmosNetworkIdType } from '@sonarwatch/portfolio-core';
import { getUrlEndpoint } from './constants';

export default function getClientCosmWasm(networkId: CosmosNetworkIdType) {
  const urlEndpoint = getUrlEndpoint(networkId);
  return CosmWasmClient.connect(urlEndpoint);
}
