import { NetworkId, Service } from '@sonarwatch/portfolio-core';
import { associatedTokenContract } from '../solana';

const platformId = 'phantom';
const contract = {
  name: 'Asset Owner',
  address: 'DeJBGdMFa1uynnnKiwrVioatTuHmNLpyFKnmB5kaFdzQ',
  platformId,
};

export const services: Service[] = [
  {
    id: `${platformId}-phoenix-market`,
    name: 'Asset Owner Verification',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract, associatedTokenContract],
  },
];
export default services;
