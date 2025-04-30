import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

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

const contract = {
  name: 'Lending',
  address: 'MLENdNkmK61mGd4Go8BJX9PhYPN3azrAKRQsAC7u55v',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-lending`,
    name: 'Lending',
    platformId,
    networkId: NetworkId.solana,
    matchTransaction: (tx) =>
      matchAnyInstructionWithPrograms(tx, [
        contract.address,
        contractV1.address,
        contractV2.address,
        priceContract.address,
      ]),
  },
];
export default services;
