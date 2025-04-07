export const permissionsLessNodeRegistryAbi = [
  {
    inputs: [],
    name: 'getCollateralETH',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_operatorId', type: 'uint256' }],
    name: 'getOperatorTotalKeys',
    outputs: [{ internalType: 'uint256', name: '_totalKeys', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'operatorIDByAddress',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const sdUtilityPoolAbi = [
  {
    inputs: [{ internalType: 'address', name: '_delegator', type: 'address' }],
    name: 'getDelegatorLatestSDBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const sdCollateralPoolAbi = [
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'operatorSDBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
