import { NetworkId, Service } from '@sonarwatch/portfolio-core';
import { kaminoLendContract } from '../kamino';

const contract = {
  name: 'Lulo',
  address: 'FL3X2pRsQ9zHENpZSKDRREtccwJuei8yg9fwDu9UN69Q',
  platformId: 'flexlend',
};

export const services: Service[] = [
  {
    id: 'flexlend',
    name: 'Lulo',
    platformId: 'flexlend',
    networkId: NetworkId.solana,
    contracts: [contract],
  },
  {
    id: 'flexlend-with-kamino',
    name: 'Lulo',
    platformId: 'flexlend',
    networkId: NetworkId.solana,
    contracts: [contract, kaminoLendContract],
  },
];
export default services;
