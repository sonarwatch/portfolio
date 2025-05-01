import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

const platformId = 'unknown';

const mevBotContract = {
  name: 'MEV 7rh...jnQ',
  address: 'oprtpYRuxviZJHAs15ARqHWtETnkZwSLni3FCkVYGVq',
  platformId,
};

const mevBotContract2 = {
  name: 'MEV 7rh...jnQ',
  address: 'chcksJgQUSrCQyVRFSQuv3Ung7wU1nLHcVzm7s81iv8',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-mev-bot`,
  name: 'MEV Bot',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      mevBotContract.address,
      mevBotContract2.address,
    ]),
};

export const services: ServiceDefinition[] = [service];
export default services;
