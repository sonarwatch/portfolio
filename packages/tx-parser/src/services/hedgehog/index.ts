import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const governanceV1Service: Service = {
  id: `${platformId}-markets`,
  name: 'Markets',
  platformId,
  networkId: NetworkId.solana,
  contracts: [ammContract, swapContract, tokensContract],
};

export const services: Service[] = [governanceV1Service];
export default services;
