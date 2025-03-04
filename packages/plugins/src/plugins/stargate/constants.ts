import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { StgConfig } from './types';

export const platformId = 'stargate';

export const platform: Platform = {
  id: platformId,
  name: 'Stargate',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/stargate.webp',
  defiLlamaId: 'stargate-v1',
  website: 'https://stargate.finance/',
};

export const poolsKey = 'pools';
export const farmsKey = 'farms';

export const stargateNetworksConfigs: StgConfig[] = [
  {
    networkId: NetworkId.ethereum,
    poolsContract: '0x06d538690af257da524f25d0cd52fd85b1c2173e',
    farmsContract: '0xb0d502e938ed5f4df2e681fe6e419ff29631d62b',
    votingEscrow: '0x0e42acbd23faee03249daff896b78d7e79fbd58e',
    stgAddress: '0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6',
  },
  {
    networkId: NetworkId.avalanche,
    poolsContract: '0x808d7c71ad2ba3fa531b068a2417c63106bc0949',
    farmsContract: '0x8731d54e9d02c286767d56ac03e8037c07e01e98',
    votingEscrow: '0xca0f57d295bbce554da2c07b005b7d6565a58fce',
    stgAddress: '0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590',
  },
  {
    networkId: NetworkId.polygon,
    farmsContract: '0x8731d54e9d02c286767d56ac03e8037c07e01e98',
    poolsContract: '0x808d7c71ad2ba3fa531b068a2417c63106bc0949',
    votingEscrow: '0x3ab2da31bbd886a7edf68a6b60d3cde657d3a15d',
    stgAddress: '0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590',
  },
];
