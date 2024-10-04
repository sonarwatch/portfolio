export const elementalIDLs = {
  address: 'ELE5vYY81W7UCpTPs7SyD6Bwm5FwZBntTW8PiGqM5d4A',
  metadata: {
    name: 'elemental_vault',
    version: '2.0.0',
    spec: '0.1.0',
    description: 'Created with Anchor',
  },
  accounts: [
    {
      name: 'Pool',
      discriminator: [241, 154, 109, 4, 17, 177, 109, 188],
    },
    {
      name: 'Position',
      discriminator: [170, 188, 143, 228, 122, 64, 247, 208],
    },
  ],
  events: [
    {
      name: 'PoolUpdatedEvent',
      discriminator: [128, 39, 94, 221, 230, 222, 127, 141],
    },
    {
      name: 'PositionUpdatedEvent',
      discriminator: [232, 11, 46, 106, 210, 142, 60, 172],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'EpochDuration',
      msg: 'Current epoch is not ended',
    },
    {
      code: 6001,
      name: 'MaxSupply',
      msg: 'Maximum supply exceeded',
    },
    {
      code: 6002,
      name: 'MaxDepositAmount',
      msg: 'Maximum deposit amount exceeded',
    },
    {
      code: 6003,
      name: 'MinDepositAmount',
      msg: 'Minimum deposit amount required',
    },
    {
      code: 6004,
      name: 'Activating',
      msg: 'Deposit is in progress',
    },
    {
      code: 6005,
      name: 'Deactivating',
      msg: 'Withdrawal is in progress',
    },
    {
      code: 6006,
      name: 'InsufficientBalance',
      msg: 'Insufficient balance to withdraw',
    },
    {
      code: 6007,
      name: 'InsufficientFaucet',
      msg: 'Insufficient balance in faucet',
    },
  ],
  types: [
    {
      name: 'Pool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'liquidity_mint',
            type: 'pubkey',
          },
          {
            name: 'liquidity_holder',
            type: 'pubkey',
          },
          {
            name: 'per_token_amount',
            type: 'u64',
          },
          {
            name: 'max_deposit_amount',
            type: 'u64',
          },
          {
            name: 'min_deposit_amount',
            type: 'u64',
          },
          {
            name: 'max_supply',
            type: 'u64',
          },
          {
            name: 'current_supply',
            type: 'u64',
          },
          {
            name: 'next_supply',
            type: 'u64',
          },
          {
            name: 'reward_per_token',
            type: 'u64',
          },
          {
            name: 'reward_annual_rate',
            type: 'u64',
          },
          {
            name: 'deactivating_amount_n0',
            type: 'u64',
          },
          {
            name: 'claiming_amount_n0',
            type: 'u64',
          },
          {
            name: 'deactivating_amount_n1',
            type: 'u64',
          },
          {
            name: 'claiming_amount_n1',
            type: 'u64',
          },
          {
            name: 'pending_amount',
            type: 'u64',
          },
          {
            name: 'epoch_duration',
            type: 'u32',
          },
          {
            name: 'epoch_index',
            type: 'u32',
          },
          {
            name: 'epoch_start_time',
            type: 'u32',
          },
          {
            name: 'authority_bump',
            type: 'u8',
          },
          {
            name: 'admin',
            type: 'pubkey',
          },
          {
            name: 'pending_admin',
            type: {
              option: 'pubkey',
            },
          },
        ],
      },
    },
    {
      name: 'PoolUpdatedData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'current_supply',
            type: 'u64',
          },
          {
            name: 'next_supply',
            type: 'u64',
          },
          {
            name: 'reward_per_token',
            type: 'u64',
          },
          {
            name: 'deactivating_amount_n0',
            type: 'u64',
          },
          {
            name: 'claiming_amount_n0',
            type: 'u64',
          },
          {
            name: 'deactivating_amount_n1',
            type: 'u64',
          },
          {
            name: 'claiming_amount_n1',
            type: 'u64',
          },
          {
            name: 'pending_amount',
            type: 'u64',
          },
          {
            name: 'epoch_index',
            type: 'u32',
          },
          {
            name: 'epoch_start_time',
            type: 'u32',
          },
        ],
      },
    },
    {
      name: 'PoolUpdatedEvent',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pubkey',
            type: 'pubkey',
          },
          {
            name: 'data',
            type: {
              defined: {
                name: 'PoolUpdatedData',
              },
            },
          },
        ],
      },
    },
    {
      name: 'Position',
      repr: {
        kind: 'c',
      },
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pool',
            type: 'pubkey',
          },
          {
            name: 'owner',
            type: 'pubkey',
          },
          {
            name: 'reward_before_deposit',
            type: 'u64',
          },
          {
            name: 'reward_earned',
            type: 'u64',
          },
          {
            name: 'reward_claimed',
            type: 'u64',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'deactivating_amount',
            type: 'u64',
          },
          {
            name: 'claiming_amount',
            type: 'u64',
          },
          {
            name: 'last_updated_epoch_index',
            type: 'u32',
          },
        ],
      },
    },
    {
      name: 'PositionUpdatedData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'reward_before_deposit',
            type: 'u64',
          },
          {
            name: 'reward_earned',
            type: 'u64',
          },
          {
            name: 'reward_claimed',
            type: 'u64',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'deactivating_amount',
            type: 'u64',
          },
          {
            name: 'claiming_amount',
            type: 'u64',
          },
          {
            name: 'last_updated_epoch_index',
            type: 'u32',
          },
        ],
      },
    },
    {
      name: 'PositionUpdatedEvent',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pubkey',
            type: 'pubkey',
          },
          {
            name: 'data',
            type: {
              defined: {
                name: 'PositionUpdatedData',
              },
            },
          },
        ],
      },
    },
  ],
};
