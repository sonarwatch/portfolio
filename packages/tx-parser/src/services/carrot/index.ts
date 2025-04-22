import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'carrot';
const minterContract = {
  name: 'Minter',
  address: 'CarrotwivhMpDnm27EHmRLeQ683Z1PufuqEmBZvD282s',
  platformId,
};

const minterService: Service = {
  id: `${platformId}-minter`,
  name: 'Minter',
  platformId,
  networkId: NetworkId.solana,
  contracts: [minterContract],
};

export const services: Service[] = [minterService];
export default services;
