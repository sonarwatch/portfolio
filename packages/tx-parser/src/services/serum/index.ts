import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'serum';
const contract = {
  name: 'CLOB V1',
  address: '4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn',
  platformId,
};

const contract2 = {
  name: 'CLOB V2',
  address: 'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o',
  platformId,
};

const contract3 = {
  name: 'CLOB V3',
  address: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-clob`,
  name: 'CLOB V1',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const service2: ServiceDefinition = {
  id: `${platformId}-clob-v2`,
  name: 'CLOB V2',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract2],
};

const service3: ServiceDefinition = {
  id: `${platformId}-clob-v3`,
  name: 'CLOB V3',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract3],
};

export const services: ServiceDefinition[] = [service, service2, service3];
export default services;
