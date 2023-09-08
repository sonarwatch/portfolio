import { PoolInfo } from '../../utils/sei';

export type PlatformContracts = {
  id: string;
  contracts: string[];
};

export type PoolInfoV1 = {
  assets: [
    {
      amount: string;
      info: TokenInfo;
    },
    {
      amount: string;
      info: TokenInfo;
    }
  ];
  total_share: string;
};

export type TokenInfo = {
  [key: string]: { [key: string]: string };
};

export type PoolInfoV2 = PoolInfo;
