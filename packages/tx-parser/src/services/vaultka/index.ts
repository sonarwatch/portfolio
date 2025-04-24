import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { jupiterV6Contract } from '../jupiter';

const platformId = 'vaultka';
const lendingV1Contracts = [
  'DE7BUY3Fa4CRc44RxRDpcknbCT6mYTY3LpZNFET7k3Hz',
  'DMhoXyVNpCFeCEfEjEQfS6gzAEcPUUSXM8Xnd2UXJfiS',
  'nKMLJtN1rr64K9DjmfzXvzaq4JEy5a4AJHHP9gY1dW6',
  '69oX4gmwgDAfXWxSRtTx9SHvWmu2bd9qVGjQPpAFHaBF',
].map((address) => ({
  name: 'Lending V1',
  address,
  platformId,
}));

const stragegyV1Contracts = [
  '6UBsNdYq3MEao1m9NXQD1VEmXvptUXhfMwdHANGAo4bs',
  'B3FS1X2PZPBrtBZiyAN9oqABnu3o5YWwdY5ioqoVh64P',
  'SkFLfp7eSRsan13dEUZSVzMBj3vdyZnhaasFKQTzuiE',
  '6VwarrrqWVWAmZtNdgGafeyoXD3SsspKxuxkZVarZqTA',
  '9p5Sc5SvR8QpJCQV3U4q6zVUTupr4Tr9Jmf48sbcSjtX',
  'FRyGij76xTvAg1nPPTaXHfa3QxUfZuKARuAyAaMyoLPo',
  'A7PDwCJ3qcdVoZLqq7wHAwMq9yEKZU2vFx7Y9qbZ1dKJ',
].map((address) => ({
  name: 'Stragegy V1',
  address,
  platformId,
}));

const vaultkaV2Contract = {
  name: 'Vaultka V2',
  address: 'V1enDN8GY531jkFp3DWEQiRxwYYsnir8SADjHmkt4RG',
  platformId,
};

const lendingV1Service: ServiceDefinition = {
  id: `${platformId}-lending-v1`,
  name: 'Lending V1',
  platformId,
  networkId: NetworkId.solana,
  contracts: [...lendingV1Contracts],
};
const strategyV1Service: ServiceDefinition = {
  id: `${platformId}-stragegy-v1`,
  name: 'Strategy V1',
  platformId,
  networkId: NetworkId.solana,
  contracts: [...stragegyV1Contracts],
};

const lendingV2Service = {
  id: `${platformId}-lending-v2`,
  name: 'Lending V2',
  platformId,
  networkId: NetworkId.solana,
  contracts: [vaultkaV2Contract],
};

const leverageService = {
  id: `${platformId}-leverage`,
  name: 'Leverage',
  platformId,
  networkId: NetworkId.solana,
  contracts: [vaultkaV2Contract, jupiterV6Contract],
};

export const services: ServiceDefinition[] = [
  lendingV1Service,
  strategyV1Service,
  lendingV2Service,
  leverageService,
];
export default services;
