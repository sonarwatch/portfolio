export const lockersAbi = {
  locks: {
    stateMutability: 'view',
    type: 'function',
    name: 'locked',
    inputs: [{ name: 'arg0', type: 'address' }],
    outputs: [
      { name: 'amount', type: 'int128' },
      { name: 'end', type: 'uint256' },
    ],
    gas: 5653,
  },
  claimableRewards: {
    inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
    name: 'claimableRewards',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        internalType: 'struct AuraLocker.EarnedData[]',
        name: 'userRewards',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  lockedBalances: {
    noBoost: {
      inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
      name: 'lockedBalances',
      outputs: [
        { internalType: 'uint256', name: 'total', type: 'uint256' },
        { internalType: 'uint256', name: 'unlockable', type: 'uint256' },
        { internalType: 'uint256', name: 'locked', type: 'uint256' },
        {
          components: [
            { internalType: 'uint112', name: 'amount', type: 'uint112' },
            { internalType: 'uint32', name: 'unlockTime', type: 'uint32' },
          ],
          internalType: 'struct AuraLocker.LockedBalance[]',
          name: 'lockData',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    boost: {
      inputs: [
        {
          internalType: 'address',
          name: '_user',
          type: 'address',
        },
      ],
      name: 'lockedBalances',
      outputs: [
        {
          internalType: 'uint256',
          name: 'total',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'unlockable',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'locked',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'uint112',
              name: 'amount',
              type: 'uint112',
            },
            {
              internalType: 'uint112',
              name: 'boosted',
              type: 'uint112',
            },
            {
              internalType: 'uint32',
              name: 'unlockTime',
              type: 'uint32',
            },
          ],
          internalType: 'struct CvxLockerV2.LockedBalance[]',
          name: 'lockData',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
  tokenOfOwnerByIndex: {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  nftLocked: {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'nftLocked',
    outputs: [
      { internalType: 'int256', name: 'amount', type: 'int256' },
      { internalType: 'uint256', name: 'end', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
} as const;

export const yearnStakeAbi = {
  pricePerShare: {
    stateMutability: 'view',
    type: 'function',
    name: 'pricePerShare',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    gas: 43519,
  },
  convertToAssets: {
    stateMutability: 'view',
    type: 'function',
    name: 'convertToAssets',
    inputs: [{ name: '_shares', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
} as const;
