export const poolAbi = [
  {
    inputs: [],
    name: 'getAssetsWithState',
    outputs: [
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        components: [
          {
            internalType: 'contract IShareToken',
            name: 'collateralToken',
            type: 'address',
          },
          {
            internalType: 'contract IShareToken',
            name: 'collateralOnlyToken',
            type: 'address',
          },
          {
            internalType: 'contract IShareToken',
            name: 'debtToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalDeposits',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'collateralOnlyDeposits',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalBorrowAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct IBaseSilo.AssetStorage[]',
        name: 'assetsStorage',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'asset',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const balanceAbi = [
  {
    inputs: [
      { internalType: 'contract ISilo', name: '_silo', type: 'address' },
      { internalType: 'address', name: '_asset', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'collateralBalanceOfUnderlying',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract ISilo', name: '_silo', type: 'address' },
      { internalType: 'address', name: '_asset', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'debtBalanceOfUnderlying',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const rewardAbi = [
  {
    inputs: [
      { internalType: 'address[]', name: 'assets', type: 'address[]' },
      { internalType: 'address', name: 'user', type: 'address' },
    ],
    name: 'getRewardsBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const rewardTokenAbi = [
  {
    inputs: [],
    name: 'REWARD_TOKEN',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const conversionRateAbi = [
  {
    inputs: [],
    name: 'asset',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
    name: 'convertToAssets',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
