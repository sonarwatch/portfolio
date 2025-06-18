import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { jupiterV6Contract } from '../jupiter';

const platformId = 'wasabi';
const contract = {
  name: 'Main',
  address: 'spicyTHtbmarmUxwFSHYpA8G4uP2nRNq38RReMpoZ9c',
  platformId,
};

const tradeService: ServiceDefinition = {
  id: `${platformId}-trade`,
  name: 'Trade',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, jupiterV6Contract],
};

const earnService: ServiceDefinition = {
  id: `${platformId}-earn`,
  name: 'Trade',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [tradeService, earnService];
export default services;
