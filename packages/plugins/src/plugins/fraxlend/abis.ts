export const pairsAbi = {
  collateralContract: {
    stateMutability: 'view',
    type: 'function',
    name: 'collateralContract',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  assetAddress: {
    stateMutability: 'view',
    type: 'function',
    name: 'asset',
    inputs: [], // Add this line
    outputs: [{ name: '', type: 'address' }], // Add this line
  },
  getAllPairAddresses: {
    inputs: [],
    name: 'getAllPairAddresses',
    outputs: [
      {
        internalType: 'address[]',
        name: '_deployedPairsArray',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
} as const;

export const lendingAbi = {
  getUserSnapshot: {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    name: 'getUserSnapshot',
    outputs: [
      { internalType: 'uint256', name: '_userAssetShares', type: 'uint256' },
      { internalType: 'uint256', name: '_userBorrowShares', type: 'uint256' },
      {
        internalType: 'uint256',
        name: '_userCollateralBalance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  maxLTV: {
    inputs: [],
    name: 'maxLTV',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  totalBorrow: {
    inputs: [],
    name: 'totalBorrow',
    outputs: [
      { internalType: 'uint128', name: 'amount', type: 'uint128' },
      { internalType: 'uint128', name: 'shares', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  totalAsset: {
    inputs: [],
    name: 'totalAsset',
    outputs: [
      { internalType: 'uint128', name: 'amount', type: 'uint128' },
      { internalType: 'uint128', name: 'shares', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
} as const;
