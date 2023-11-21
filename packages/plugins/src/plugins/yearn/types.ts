import { Network } from '@sonarwatch/portfolio-core';

export type Contract = {
  address: string;
  underlying: string;
};

export type LockerInfo = {
  amount: bigint;
  unlockTime: bigint;
};

export type YearnConfig = {
  network: Network;
  chainId: number;
};

export type VaultData = {
  address: string;
  symbol: string;
  display_name: string;
  token: {
    name: string;
    symbol: string;
    address: string;
    decimals: string;
    display_name: string;
    icon: string;
  };
  tvl: {
    total_assets: string;
    price: string;
    tvl: string;
  };
  apy: {
    type: string;
    gross_apr: string;
    net_apy: string;
    fees: {
      performance: string;
      withdrawal: string;
      management: string;
      keep_crv: string;
      cvx_keep_crv: string;
      keep_velo: string;
    };
    points: {
      week_ago: string;
      month_ago: string;
      inception: string;
    };
    blocks: {
      now: string;
      week_ago: string;
      month_ago: string;
      inception: string;
    };
    composite: string;
    error_reason: string;
    staking_rewards_apr: string;
  };
  strategies: [
    {
      address: string;
      name: string;
    },
    {
      address: string;
      name: string;
    },
    {
      address: string;
      name: string;
    }
  ];
  endorsed: boolean;
  decimals: string;
  type: string;
};
