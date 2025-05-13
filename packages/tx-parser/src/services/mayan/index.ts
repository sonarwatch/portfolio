import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { jupiterV6Contract } from '../jupiter';

const platformId = 'mayan';
const contract = {
  name: 'Swift',
  address: 'BLZRi6frs4X4DNLw56V4EXai1b6QVESN1BhHBTYM9VcY',
  platformId,
};

const claimService: ServiceDefinition = {
  id: `${platformId}-claim`,
  name: 'Claim',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const bridgeService: ServiceDefinition = {
  id: `${platformId}-bridge`,
  name: 'Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, jupiterV6Contract],
};

export const services: ServiceDefinition[] = [claimService, bridgeService];
export default services;
