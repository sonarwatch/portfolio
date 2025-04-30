import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'amulet';
const contract = {
  name: 'Core',
  address: 'AFX6h67CCoqcJcoFbq12dabMLDruQ38U2nogpeU7ECLa',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-core`,
  name: 'Core',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
