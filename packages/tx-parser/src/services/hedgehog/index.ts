import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'hedgehog';
const ammContract = {
  name: 'AMM',
  address: 'Hr4whNgXr3yZsJvx3TVSwfsFgXuSEPB1xKmvgrtLhsrM',
  platformId,
};

const swapContract = {
  name: 'Swap',
  address: '2ZznCMfx2XP43zaPw9R9wKnjXWiEeEexyhdBPv3UqDtD',
  platformId,
};

const tokensContract = {
  name: 'Tokens',
  address: 'D8vMVKonxkbBtAXAxBwPPWyTfon8337ARJmHvwtsF98G',
  platformId,
};

const governanceV1Service: ServiceDefinition = {
  id: `${platformId}-markets`,
  name: 'Markets',
  platformId,
  networkId: NetworkId.solana,
  contracts: [ammContract, swapContract, tokensContract],
};

export const services: ServiceDefinition[] = [governanceV1Service];
export default services;
