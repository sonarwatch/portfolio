import { NetworkId } from '@sonarwatch/portfolio-core';
import { metaplexContract } from '../metaplex';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'solsea';

export const contract = {
  name: 'Marketplace',
  address: '617jbWo616ggkDxvW1Le8pV38XLbVSyWY8ae6QUmGBAU',
  platformId,
};

export const solanaStakingService: ServiceDefinition = {
  id: `${platformId}-marketplace`,
  name: 'Marketplace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, metaplexContract],
};

export const services: ServiceDefinition[] = [solanaStakingService];
export default services;
