import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'carrot';
const minterContract = {
  name: 'Minter',
  address: 'CarrotwivhMpDnm27EHmRLeQ683Z1PufuqEmBZvD282s',
  platformId,
};

const minterService: ServiceDefinition = {
  id: `${platformId}-minter`,
  name: 'Minter',
  platformId,
  networkId: NetworkId.solana,
  contracts: [minterContract],
};

export const services: ServiceDefinition[] = [minterService];
export default services;
