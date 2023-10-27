export const getPoolTokensAbi = [
  {
    inputs: [{ internalType: 'bytes32', name: 'poolId', type: 'bytes32' }],
    name: 'getPoolTokens',
    outputs: [
      { internalType: 'contract IERC20[]', name: 'tokens', type: 'address[]' },
      { internalType: 'uint256[]', name: 'balances', type: 'uint256[]' },
      { internalType: 'uint256', name: 'lastChangeBlock', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const getTotalRewardsAbi = [
  {
    inputs: [{ internalType: 'address', name: 'staker', type: 'address' }],
    name: 'getTotalRewardsBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const totalSupplyAbi = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const pendingWithdrawalsAbi = [
  {
    name: 'userVsWithdrawals',
    inputs: [
      { internalType: 'address', name: 'staker', type: 'address' },
      { internalType: 'int256', name: 'id', type: 'int256' },
    ],
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'releaseTime',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const userVsWithdrawalsAbi = [
  {
    name: 'userVsWithdrawals',
    inputs: [
      { internalType: 'address', name: 'staker', type: 'address' },
      { internalType: 'int256', name: 'id', type: 'int256' },
    ],
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountPSP',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'releaseBlockNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const userVsNextIDAbi = [
  {
    name: 'userVsNextID',
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    outputs: [
      {
        internalType: 'int256',
        name: 'nextID',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
