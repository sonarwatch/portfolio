import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { jupiterV6Contract } from '../jupiter';

const platformId = 'relay';
const contract = {
  name: 'WSOL Unwrapper',
  address: 'DzACDmwdqc5ADPJKnZEcQAgpsPdvYzvYBMihPNN48pFE',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-bridge`,
  name: 'Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, jupiterV6Contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
