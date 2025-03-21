import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const bsktStakingContract = {
  name: 'BSKT Staking',
  address: 'DF8vgzUDH2CGywD7Gd9jd9Y5Kwmrx97h4Viumjo4rrr6',
  platformId: 'bskt',
};

export const bsktStakingService: Service = {
  id: 'bskt-staking',
  name: 'BSKT Staking',
  platformId: 'bskt',
  networkId: NetworkId.solana,
  contracts: [bsktStakingContract],
};

export const services: Service[] = [bsktStakingService];
export default services;
