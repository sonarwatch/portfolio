import BigNumber from 'bignumber.js';
import { ID } from '../../utils/sui/types/id';

export type Credential = {
  acc_reward_per_share: string;
  id: ID;
  lock_until: string;
  stake: string;
};

export type Pool = {
  acc_reward_per_share: string;
  enabled: boolean;
  end_time: string;
  id: ID;
  last_updated_time: string;
  lock_duration: string;
  reward: string;
  staked_amount: string;
  start_time: string;
};

export type Market = {
  id: ID;
  name: {
    type: string;
    fields: {
      dummy_field: boolean;
    };
  };
  value: {
    type: string;
    fields: MarketFields;
  };
};

export type MarketFields = {
  acc_reserving_rate: {
    type: string;
    fields: {
      value: string;
    };
  };
  enabled: boolean;
  last_update: string;
  liquidity: string;
  price_config: {
    type: string;
    fields: {
      feeder: string;
      max_confidence: string;
      max_interval: string;
      precision: string;
    };
  };
  reserved_amount: string;
  reserving_fee_model: string;
  unrealised_reserving_fee_amount: {
    type: string;
    fields: {
      value: string;
    };
  };
  weight: {
    type: string;
    fields: {
      value: string;
    };
  };
};

export interface IMarketInfo {
  lpSupply: string;
  positionId: string;
  vaultId: string;
  symbolId: string;
  referralId: string;
  orderId: string;
  rebaseFeeModel: string;
  lpSupplyWithDecimals: number;
}

export interface IRebaseFeeModel {
  base: number;
  multiplier: number;
}

export interface IReservingFeeModel {
  multiplier: number;
}

export interface IFundingFeeModel {
  multiplier: number;
  max: number;
}

export interface IVaultInfo {
  liquidity: number;
  reservedAmount: number;
  unrealisedReservingFeeAmount: number;
  accReservingRate: number;
  enabled: boolean;
  weight: number;
  lastUpdate: number;
  reservingFeeModel: IReservingFeeModel;
  priceConfig: {
    maxInterval: number;
    maxConfidence: number;
    precision: number;
    feeder: string;
  };
}

export interface ISymbolInfo {
  openingSize: number;
  openingAmount: number;
  accFundingRate: number;
  realisedPnl: number;
  unrealisedFundingFeeValue: number;
  openEnabled: boolean;
  liquidateEnabled: boolean;
  decreaseEnabled: boolean;
  lastUpdate: number;
  fundingFeeModel: IFundingFeeModel;
  long: boolean;
  priceConfig: {
    maxInterval: number;
    maxConfidence: number;
    precision: number;
    feeder: string;
  };
}

export interface IPositionInfo {
  id: string;
  long: boolean;
  owner: string;
  version: number;

  collateralToken: string;
  indexToken: string;

  collateralAmount: number;
  positionAmount: number;
  reservedAmount: number;

  positionSize: number;
  lastFundingRate: number;
  lastReservingRate: number;

  reservingFeeAmount: number;
  fundingFeeValue: number;

  closed: boolean;

  openTimestamp: number;

  openFeeBps: number;
}

export interface IPositionCapInfo {
  positionCapId: string;
  symbol0: string;
  symbol1: string;
  long: boolean;
}

export interface IOrderCapInfo {
  orderCapId: string;
  symbol0: string;
  symbol1: string;
  long: boolean;
  positionId: string | null;
}

export interface IOrderInfo {
  id: string;
  capId: string;
  executed: boolean;
  owner: string;
  collateralToken: string;
  indexToken: string;
  feeToken: string;
  collateralPriceThreshold: number;
  feeAmount: BigNumber;
  long: boolean;
  indexPrice: number;
  openOrder?: {
    reserveAmount: BigNumber;
    collateralAmount: BigNumber;
    openAmount: BigNumber;
  };
  decreaseOrder?: {
    decreaseAmount: BigNumber;
    takeProfit: boolean;
  };
  orderType: 'OPEN_POSITION' | 'DECREASE_POSITION';
  createdAt: number;
  v11Order: boolean;
}

export interface IMarketValuationInfo {
  marketCap: number;
  alpPrice: number;
  alpSupply: number;
  apr?: number;
}

export interface IPositionConfig {
  decreaseFeeBps: number;
  liquidationBonus: number;
  liquidationThreshold: number;
  maxLeverage: number;
  minHoldingDuration: number;
  openFeeBps: number;
  maxReservedMultiplier: number;
  minCollateralValue: number;
}

export interface IHistory {
  owner: string;
  txid: string;
  id: string;
  created: number;
  eventName: string;
  parsedDetail: {
    [key: string]: any;
  };
  detailRaw: string;
  volume: number;
  network: string;
}

export interface IStaked {
  credentials: ICredential[];
  amount: bigint;
  claimable: bigint;
}

export interface ICredential {
  id: string;
  lockUntil: number;
  accRewardPerShare: bigint;
  amount: bigint;
  claimable: bigint;
}

export interface IStakePool {
  id: string;
  enabled: boolean;
  lastUpdatedTime: number;
  stakedAmount: bigint;
  reward: bigint;
  startTime: number;
  endTime: number;
  accRewardPerShare: bigint;
  lockDuration: number;
}

export interface ICoin {
  decimals: number;
  module: string;
  metadata: string;
  treasury?: string | null;
}
