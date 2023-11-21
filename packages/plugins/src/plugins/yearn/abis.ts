export const abi = {
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
