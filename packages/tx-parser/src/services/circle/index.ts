import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'circle';

const minterContract = {
  name: 'CCTP',
  address: 'CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3',
  platformId,
};
const transmitterContract = {
  name: 'CCTP',
  address: 'CCTPmbSD7gX1bxKPAmg77w8oFzNFpaQiQUWD43TKaecd',
  platformId,
};

const minterService: ServiceDefinition = {
  id: `${platformId}-cctp-minter`,
  name: 'CCTP',
  platformId,
  networkId: NetworkId.solana,
  contracts: [minterContract],
};

const transmitterService: ServiceDefinition = {
  id: `${platformId}-cctp-transmitter`,
  name: 'CCTP',
  platformId,
  networkId: NetworkId.solana,
  contracts: [transmitterContract],
};

export const services: ServiceDefinition[] = [
  minterService,
  transmitterService,
];
export default services;
