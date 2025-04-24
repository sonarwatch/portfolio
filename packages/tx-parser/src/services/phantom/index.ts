import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { associatedTokenContract } from '../solana';

const platformId = 'phantom';
const contract = {
  name: 'Asset Owner',
  address: 'DeJBGdMFa1uynnnKiwrVioatTuHmNLpyFKnmB5kaFdzQ',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-swap`,
    name: 'Swap',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract, associatedTokenContract],
  },
];
export default services;
