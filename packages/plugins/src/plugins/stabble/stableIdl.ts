export const StableIdl = {
  version: '1.0.0',
  name: 'stable_swap',
  instructions: [],
  accounts: [
    {
      name: 'pool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'vault',
            type: 'publicKey',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'authorityBump',
            type: 'u8',
          },
          {
            name: 'isActive',
            type: 'bool',
          },
          {
            name: 'ampInitialFactor',
            type: 'u16',
          },
          {
            name: 'ampTargetFactor',
            type: 'u16',
          },
          {
            name: 'rampStartTs',
            type: 'i64',
          },
          {
            name: 'rampStopTs',
            type: 'i64',
          },
          {
            name: 'swapFee',
            type: 'u64',
          },
          {
            name: 'tokens',
            type: {
              vec: {
                defined: 'PoolToken',
              },
            },
          },
          {
            name: 'pendingOwner',
            type: {
              option: 'publicKey',
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'PoolToken',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'decimals',
            type: 'u8',
          },
          {
            name: 'scalingUp',
            type: 'bool',
          },
          {
            name: 'scalingFactor',
            type: 'u64',
          },
          {
            name: 'balance',
            type: 'u64',
          },
        ],
      },
    },
  ],
  errors: [],
};
