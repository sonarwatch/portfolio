export const tokenOfOwnerByIndexAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const positionsAbi = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'positions',
    outputs: [
      { internalType: 'uint96', name: 'nonce', type: 'uint96' },
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'address', name: 'token0', type: 'address' },
      { internalType: 'address', name: 'token1', type: 'address' },
      { internalType: 'uint24', name: 'fee', type: 'uint24' },
      { internalType: 'int24', name: 'tickLower', type: 'int24' },
      { internalType: 'int24', name: 'tickUpper', type: 'int24' },
      { internalType: 'uint128', name: 'liquidity', type: 'uint128' },
      {
        internalType: 'uint256',
        name: 'feeGrowthInside0LastX128',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthInside1LastX128',
        type: 'uint256',
      },
      { internalType: 'uint128', name: 'tokensOwed0', type: 'uint128' },
      { internalType: 'uint128', name: 'tokensOwed1', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const getPoolsAbi = [
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint24', name: '', type: 'uint24' },
    ],
    name: 'getPool',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const slot0Abi = [
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'observationIndex', type: 'uint16' },
      {
        internalType: 'uint16',
        name: 'observationCardinality',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinalityNext',
        type: 'uint16',
      },
      { internalType: 'uint8', name: 'feeProtocol', type: 'uint8' },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const ticksAbi = [
  {
    inputs: [{ internalType: 'int24', name: '', type: 'int24' }],
    name: 'ticks',
    outputs: [
      { internalType: 'uint128', name: 'liquidityGross', type: 'uint128' },
      { internalType: 'int128', name: 'liquidityNet', type: 'int128' },
      {
        internalType: 'uint256',
        name: 'feeGrowthOutside0X128',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthOutside1X128',
        type: 'uint256',
      },
      { internalType: 'int56', name: 'tickCumulativeOutside', type: 'int56' },
      {
        internalType: 'uint160',
        name: 'secondsPerLiquidityOutsideX128',
        type: 'uint160',
      },
      { internalType: 'uint32', name: 'secondsOutside', type: 'uint32' },
      { internalType: 'bool', name: 'initialized', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const feeGrowthGlobal0X128Abi = [
  {
    inputs: [],
    name: 'feeGrowthGlobal0X128',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const feeGrowthGlobal1X128Abi = [
  {
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
