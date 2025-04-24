import { NetworkId, Service } from '@sonarwatch/portfolio-core';
import { metaplexContract } from '../metaplex';

const platformId = 'solsea';

export const contract = {
  name: 'Marketplace',
  address: '617jbWo616ggkDxvW1Le8pV38XLbVSyWY8ae6QUmGBAU',
  platformId,
};

export const solanaStakingService: Service = {
  id: `${platformId}-marketplace`,
  name: 'Marketplace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, metaplexContract],
};

export const services: Service[] = [solanaStakingService];
export default services;
