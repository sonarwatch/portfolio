import { NetworkId, Service } from '@sonarwatch/portfolio-core';
import { defiTunaProgram, platformId } from './constants';

const defiTunaContract = {
  name: 'DefiTuna',
  address: defiTunaProgram.toString(),
};

export const defiTunaService: Service = {
  id: `${platformId}`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [defiTunaContract],
};

export const services = [defiTunaService];
