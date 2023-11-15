export const stakersAbi = {
  balanceOf: {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  stakedToken: {
    inputs: [],
    name: 'stakedToken',
    outputs: [
      { internalType: 'contract IERC20Metadata', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  pendingReward: {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'pendingReward',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  rewardToken: {
    inputs: [],
    name: 'rewardToken',
    outputs: [
      { internalType: 'contract IERC20Metadata', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  userInfo: {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userInfo',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  userInfos: {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userInfo',
    outputs: [
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'uint256', name: 'lastDepositedTime', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'cakeAtLastUserAction',
        type: 'uint256',
      },
      { internalType: 'uint256', name: 'lastUserActionTime', type: 'uint256' },
      { internalType: 'uint256', name: 'lockStartTime', type: 'uint256' },
      { internalType: 'uint256', name: 'lockEndTime', type: 'uint256' },
      { internalType: 'uint256', name: 'userBoostedShare', type: 'uint256' },
      { internalType: 'bool', name: 'locked', type: 'bool' },
      { internalType: 'uint256', name: 'lockedAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  totalShares: {
    type: 'function',
    name: 'totalShares',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
} as const;

export const farmsAbi = {
  poolInfo: {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'poolInfo',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: 'lpToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'mcv2PoolId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  poolLength: {
    inputs: [],
    name: 'poolLength',
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
  userInfo: {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastActionTime',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
} as const;
