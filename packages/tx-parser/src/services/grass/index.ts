import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'grass';
const contract = {
  name: 'Staking',
  address: 'EyxPPowqBRTpZpiDb2ixUR6XUU1VJwTCNgJdK8eyc6kc',
  platformId,
};

const airdropContract = {
  name: 'Airdrop',
  address: 'Eohp5jrnGQgP74oD7ij9EuCSYnQDLLHgsuAmtSTuxABk',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
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
