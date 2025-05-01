import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

const platformId = 'openbook';
const contract = {
  name: 'V1',
  address: 'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX',
  platformId,
};

const contract2 = {
  name: 'V2',
  address: 'opnbkNkqux64GppQhwbyEVc3axhssFhVYuwar8rDHCu',
  platformId,
};

const contractV2 = {
  name: 'V2',
  address: 'opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-v1`,
  name: 'V1',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const service2: ServiceDefinition = {
  id: `${platformId}-v2`,
  name: 'V2',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      contract2.address,
      contractV2.address,
    ]),
};

export const services: ServiceDefinition[] = [service, service2];
export default services;
