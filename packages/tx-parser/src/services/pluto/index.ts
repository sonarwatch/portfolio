import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { jupiterV6Contract } from '../jupiter';

const platformId = 'pluto';

const contract = {
  name: 'Leverage Machine',
  address: '5UFYdXHgXLMsDzHyv6pQW9zv3fNkRSNqHwhR7UPnkhzy',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-leverage`,
  name: 'Leverage',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};
const withJupiterSwapService: ServiceDefinition = {
  id: `${platformId}-leverage-with-jupiter-swap`,
  name: 'Leverage',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, jupiterV6Contract],
};

export const services: ServiceDefinition[] = [service, withJupiterSwapService];
export default services;
