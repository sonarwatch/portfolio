import { NetworkId } from '@sonarwatch/portfolio-core';

import { RenzoNetworkConfig } from './types';

export const platformId = 'renzo';

export const STAKED_LABEL = 'Staked';
export const DEPOSIT_LABEL = 'Deposit';

export const renzoNetworkConfigs: RenzoNetworkConfig[] = [
  {
    networkId: NetworkId.ethereum,
    stakedContracts: [
      {
        address: '0xbf5495efe5db9ce00f80364c8b423567e58d2110',
        token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      },
      {
        address: '0xd4fcde9bb1d746dd7e5463b01dd819ee06af25db',
        token: '0xec53bf9167f50cdeb3ae105f56099aaab9061f83',
      },
      {
        address: '0x77b1183e730275f6a8024ce53d54bcc12b368f60',
        token: '0x3b50805453023a91a8bf641e279401a0b23fa6f9',
      },
    ],
    activeStakeContract: {
      address: '0x1736011d3e075351b319dbc1da28dac68ea830a6',
      token: '0x3b50805453023a91a8bf641e279401a0b23fa6f9',
    },
    depositContract: {
      address: '0x5efc9d10e42fb517456f4ac41eb5e2ebe42c8918',
    },
  },
];
