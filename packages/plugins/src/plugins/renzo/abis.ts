export const activeStakeAbi = [
  {
    type: 'function',
    name: 'activeStake',
    stateMutability: 'view',
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
] as const;

export const balanceOfAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
] as const;

export const getOutstandingWithdrawRequestsAbi = [
  {
    type: 'function',
    name: 'getOutstandingWithdrawRequests',
    stateMutability: 'view',
    inputs: [
      {
        name: 'user',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
] as const;

export const withdrawRequestAbi = [
  {
    type: 'function',
    name: 'withdrawRequests',
    stateMutability: 'view',
    inputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'collateralToken',
        type: 'address',
      },
      {
        name: 'withdrawRequestID',
        type: 'uint256',
      },
      {
        name: 'amountToRedeem',
        type: 'uint256',
      },
      {
        name: 'ezETHLocked',
        type: 'uint256',
      },
      {
        name: 'createdAt',
        type: 'uint256',
      },
    ],
  },
] as const;
