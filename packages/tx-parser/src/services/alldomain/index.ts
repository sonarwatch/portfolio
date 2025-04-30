import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

const platformId = 'alldomain';
const contract = {
  name: 'Name Service',
  address: 'ALTNSZ46uaAUU7XUV6awvdorLGqAsPwa9shm7h4uP2FK',
  platformId,
};

const coSignerContract = {
  name: 'Top Level Domain CoSigner',
  address: 'TCSVHqadS2swhap43BnZtmeEAPNXfpc3w2HLBredVaR',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-name-service`,
  name: 'Name Service',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      contract.address,
      coSignerContract.address,
    ]),
};

export const services: ServiceDefinition[] = [service];
export default services;
