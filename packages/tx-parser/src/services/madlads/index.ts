import { NetworkId, Service } from '@sonarwatch/portfolio-core';
import { vestingContract } from '../streamflow';

const platformId = 'madlads';
const solboundContract = {
  name: 'SolBound',
  address: '7DkjPwuKxvz6Viiawtbmb4CqnMKP6eGb1WqYas1airUS',
  platformId,
};

const service: Service = {
  id: `${platformId}-launch`,
  name: 'W Claim',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solboundContract, vestingContract],
};

export const services: Service[] = [service];
export default services;
