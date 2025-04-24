import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { metaplexContract } from '../metaplex';

const platformId = 'solincinerator';

export const contract = {
  name: 'Incinerator',
  address: 'F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7',
  platformId,
};

export const solanaStakingService: ServiceDefinition = {
  id: `${platformId}-incinerator`,
  name: 'Incinerator',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, metaplexContract],
};

export const services: ServiceDefinition[] = [solanaStakingService];
export default services;
