import { NetworkId } from '@sonarwatch/portfolio-core';
import { bubblegumContract } from '../metaplex';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'underdog';

const mainContract = {
  name: 'Core',
  address: 'updg8JyjrmFE2h3d71p71zRXDR8q4C6Up8dDoeq3LTM',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-core`,
  name: 'Core',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

const metadataService: ServiceDefinition = {
  id: `${platformId}-metadata`,
  name: 'Metadata',
  platformId,
  networkId: NetworkId.solana,
  contracts: [bubblegumContract, mainContract],
};
export const services: ServiceDefinition[] = [service, metadataService];
export default services;
