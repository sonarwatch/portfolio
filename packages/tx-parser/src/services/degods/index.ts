import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

const platformId = 'degods';
const farmContract = {
  name: 'GEM Farm',
  address: 'FQzYycoqRjmZTgCcTTAkzceH2Ju8nzNLa5d78K3yAhVW',
  platformId,
};

const bankContract = {
  name: 'GEM Bank',
  address: '6VJpeYFy87Wuv4KvwqD5gyFBTkohqZTqs6LgbCJ8tDBA',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      farmContract.address,
      bankContract.address,
    ]),
};

export const services: ServiceDefinition[] = [service];
export default services;
