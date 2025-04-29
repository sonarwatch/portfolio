import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'texture';

const contractV1 = {
  name: 'Lending',
  address: 'MLENdNkmK61mGd4Go8BJX9PhYPN3azrAKRQsAC7u55v',
  platformId,
};

const contractV2 = {
  name: 'Lending',
  address: 'sUperbZBsdZa4s7pWPKQaQ2fRTesjKxupxagZ8FSgVi',
  platformId,
};

const priceContract = {
  name: 'Price',
  address: 'priceEvKXX3KERsitDpmvujXfPFYesmEspw4kiC3ryF',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-lendy`,
    name: 'Lending',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contractV1],
  },
  {
    id: `${platformId}-superlendy`,
    name: 'Lending',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contractV2],
  },
];
export default services;
