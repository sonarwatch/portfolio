import { NetworkId } from '@sonarwatch/portfolio-core';

import { RenzoNetworkConfig } from './types';

export const platformId = 'renzo';

export const renzoNetworkConfigs: RenzoNetworkConfig[] = [
  {
    networkId: NetworkId.ethereum,
    stakedContracts: [
      {
        address: '0xbF5495eFe5Db9Ce00f80364C8B423567e58D2110',
        assetName: 'ezETH',
        token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      },
      {
        address: '0xD4fCDe9Bb1D746dD7E5463b01Dd819EE06Af25DB',
        assetName: 'ezEIGEN',
        token: '0xec53BF9167f50cdEB3AE105F56099aAab9061F83',
      },
      {
        address: '0x77B1183E730275f6A8024CE53d54BCC12B368f60',
        assetName: 'ezREZ',
        token: '0x3B50805453023a91a8Bf641e279401a0b23fA6f9',
      },
    ],
    activeStakeContract: {
      address: '0x1736011D3E075351b319DbC1dA28Dac68ea830A6',
      assetName: 'ezREZ',
      token: '0x3B50805453023a91a8Bf641e279401a0b23fA6f9',
    },
    depositContract: {
      address: '0x5efc9D10e42Fb517456f4ac41eB5E2eBe42C8918',
      assetName: 'ezETH',
    },
  },
];
