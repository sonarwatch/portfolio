import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'carrot';

const minterContract = {
  name: 'Minter',
  address: 'CarrotwivhMpDnm27EHmRLeQ683Z1PufuqEmBZvD282s',
  platformId,
};

const boostContract = {
  name: 'Boost',
  address: 'C73nDAFn23RYwiFa6vtHshSbcg8x6BLYjw3bERJ3vHxf',
  platformId,
};

const minterService: ServiceDefinition = {
  id: `${platformId}-minter`,
  name: 'Minter',
  platformId,
  networkId: NetworkId.solana,
  contracts: [minterContract],
};
const boostService: ServiceDefinition = {
  id: `${platformId}-boost`,
  name: 'Boost',
  platformId,
  networkId: NetworkId.solana,
  contracts: [boostContract],
};

export const services: ServiceDefinition[] = [minterService, boostService];
export default services;
