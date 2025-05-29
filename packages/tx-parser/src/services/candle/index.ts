import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'candle';

const stakingContract = {
  name: 'Staking',
  address: 'CNDL7Y1SYqvSF34aXayqHjm2JZrHB7BfhhVi3TUan3fe',
  platformId,
};

const minterService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [minterService];
export default services;
