import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { kaminoLendContract } from '../kamino';

const contract = {
  name: 'Lulo',
  address: 'FL3X2pRsQ9zHENpZSKDRREtccwJuei8yg9fwDu9UN69Q',
  platformId: 'flexlend',
};

export const services: ServiceDefinition[] = [
  {
    id: 'flexlend',
    name: 'Lending',
    platformId: 'flexlend',
    networkId: NetworkId.solana,
    contracts: [contract],
  },
  {
    id: 'flexlend-with-kamino',
    name: 'Lending',
    platformId: 'flexlend',
    networkId: NetworkId.solana,
    contracts: [contract, kaminoLendContract],
  },
];
export default services;
