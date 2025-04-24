import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const paymentService: Service = {
  id: `${platformId}-payment`,
  name: 'Payment',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contractV2],
};

const paymentV2Service: Service = {
  id: `${platformId}-payment-v1`,
  name: 'Payment V1',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contractV1],
};

export const services: Service[] = [paymentService, paymentV2Service];
export default services;
