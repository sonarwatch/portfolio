import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'bloom';
const contract = {
  name: 'Router',
  address: 'b1oomGGqPKGD6errbyfbVMBuzSC8WtAAYo8MwNafWW1',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-bot`,
  name: 'Bot',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
