import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';

export type PoolInfo = {
  id: `0x${string}`;
  slot0: {
    sqrtPriceX96: string | undefined;
    tick: number | undefined;
    observationIndex: number | undefined;
    observationCardinality: number | undefined;
    observationCardinalityNext: number | undefined;
    feeProtocol: number | undefined;
    unlocked: boolean | undefined;
  };
  fees: {
    zeroX: number | undefined;
    oneX: number | undefined;
  };
};

export type Position = {
  nonce: bigint;
  operator: `0x${string}`;
  token0: `0x${string}`;
  token1: `0x${string}`;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
};

export type Tick = {
  liquidityGross: bigint;
  liquidityNet: bigint;
  feeGrowthOutside0X128: bigint;
  feeGrowthOutside1X128: bigint;
  tickCumulativeOutside: bigint;
  secondsPerLiquidityOutsideX128: bigint;
  secondsOutside: number;
  initialized: boolean;
};

export type PositionData = {
  userPosition: Position;
  poolAddress: `0x${string}`;
  poolInfo?: PoolInfo;
  ticks?: {
    lower: Tick;
    upper: Tick;
  };
};

export type UniswapNetworkConfig = {
  networkId: EvmNetworkIdType;
  positionManager: `0x${string}`;
  factory: `0x${string}`;
};
