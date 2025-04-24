import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'marinade';
const contract = {
  name: 'Ticket',
  address: 'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD',
  platformId,
};

const airdropContract = {
  name: 'Airdrop',
  address: 'indiXdKbsC4QSLQQnn6ngZvkqfywn6KgEeQbkGSpk1V',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-ticket`,
  name: 'Ticket',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

export const services: ServiceDefinition[] = [service, airdropService];
export default services;
