export const liteAbiV2 = [
  {
    inputs: [],
    name: 'exchangePrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const liteAbiV1 = [
  {
    inputs: [],
    name: 'getCurrentExchangePrice',
    outputs: [
      { internalType: 'uint256', name: 'exchangePrice_', type: 'uint256' },
      { internalType: 'uint256', name: 'newRevenue_', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
