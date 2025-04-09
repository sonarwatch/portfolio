export const morphoContractABI = [
  {
    inputs: [{ internalType: 'Id', name: '', type: 'bytes32' }],
    name: 'market',
    outputs: [
      { internalType: 'uint128', name: 'totalSupplyAssets', type: 'uint128' },
      { internalType: 'uint128', name: 'totalSupplyShares', type: 'uint128' },
      { internalType: 'uint128', name: 'totalBorrowAssets', type: 'uint128' },
      { internalType: 'uint128', name: 'totalBorrowShares', type: 'uint128' },
      { internalType: 'uint128', name: 'lastUpdate', type: 'uint128' },
      { internalType: 'uint128', name: 'fee', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Id', name: '', type: 'bytes32' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'position',
    outputs: [
      { internalType: 'uint256', name: 'supplyShares', type: 'uint256' },
      { internalType: 'uint128', name: 'borrowShares', type: 'uint128' },
      { internalType: 'uint128', name: 'collateral', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const morphoVaultABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
