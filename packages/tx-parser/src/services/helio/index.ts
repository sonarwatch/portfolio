import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'helio';
const contractV2 = {
  name: 'Payment',
  address: 'ENicYBBNZQ91toN7ggmTxnDGZW14uv9UkumN7XBGeYJ4',
  platformId,
};

const contractV1 = {
  name: 'Payment V1',
  address: '3KPRuKWxV6PtneZXbokMBwdF4T9brCFx7FcmKJ2tPqqt',
  platformId,
};

const paymentService: ServiceDefinition = {
  id: `${platformId}-payment`,
  name: 'Payment',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contractV2],
};

const paymentV2Service: ServiceDefinition = {
  id: `${platformId}-payment-v1`,
  name: 'Payment V1',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contractV1],
};

export const services: ServiceDefinition[] = [paymentService, paymentV2Service];
export default services;
