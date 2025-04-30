import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

const platformId = 'saber';
const stableswapContract = {
  name: 'Stable Swap',
  address: 'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ',
  platformId,
};

const swapContract = {
  name: 'Swap',
  address: 'YAkoNb6HKmSxQN9L8hiBE5tPJRsniSSMzND1boHmZxe',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-swap`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      stableswapContract.address,
      swapContract.address,
    ]),
};

export const services: ServiceDefinition[] = [service];
export default services;
