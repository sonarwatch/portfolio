import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'hawksight';
const mainContract = {
  name: 'Main',
  address: 'FqGg2Y1FNxMiGd51Q6UETixQWkF5fB92MysbYogRJb3P',
  platformId,
};

const mainService: ServiceDefinition = {
  id: `${platformId}-core`,
  name: 'Core',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

export const services: ServiceDefinition[] = [mainService];
export default services;
