import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'photon';
const mainContract = {
  name: 'Swap',
  address: 'BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW',
  platformId,
};

export const services: Service[] = [
  {
    id: `${platformId}-swap`,
    name: 'Swap',
    platformId,
    networkId: NetworkId.solana,
    contracts: [mainContract],
  },
];
export default services;
