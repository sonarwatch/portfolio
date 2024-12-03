// Farm

import { ID } from '../../../utils/sui/types/id';

export type FarmInfo = {
  tokenXReserve: string;
  lspSupply: string;
  protocolFeesPercent: string;
  createdAt: Date;
  farmSource: FarmSource;
  volume: number;
  packageId: string;
  farmId: string;
  objectId: string;
  poolSource: PoolSource;
  lspType: string;
  lpFeesPercent: string;
  tokenYType: string;
  data: string;
  updatedAt: Date;
  isStable: boolean;
  tokenXType: string;
  tokenYReserve: string;
  tokenX: Token;
  tokenY: Token;
  tvl: number;
  apy: number;
  feeApy: number;
};

export enum FarmSource {
  Buck = 'buck',
  Empty = '',
  Kriya = 'kriya',
}

export enum PoolSource {
  Deepbook = 'deepbook',
  DeepbookV2 = 'deepbook_v2',
  Kriya = 'kriya',
}

export type Token = {
  coinType: string;
  ticker: string;
  tokenName: string;
  updatedAt: Date;
  createdAt: Date;
  decimals: number;
  iconUrl: string;
  description: string;
  price: string;
};

export type FarmPosition = {
  farm_id: string;
  id: ID;
  lock_until: string;
  stake_amount: string;
  stake_weight: string;
  start_unit: string;
};
