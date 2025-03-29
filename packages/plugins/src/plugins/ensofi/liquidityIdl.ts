export const liquidityIdl = {
  address: 'ensSuXMeaUhRC7Re3ukaxLcX2E4qmd2LZxbxsK9XcWz',
  metadata: {
    name: 'ensofi_liquidity',
    version: '0.1.9',
    spec: '0.1.0',
    description: 'Created with Anchor',
  },
  instructions: [
    {
      name: 'claim_trading_fee',
      discriminator: [8, 236, 89, 49, 152, 125, 177, 81],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'payer', signer: true },
        {
          name: 'nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'nft_account' },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_lower_index',
                account: 'PersonalPositionState',
              },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_upper_index',
                account: 'PersonalPositionState',
              },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        { name: 'pool_personal_position', writable: true },
        { name: 'tick_array_lower', writable: true },
        { name: 'tick_array_upper', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'user_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 115, 101, 114, 95, 112, 111, 115, 105, 116, 105, 111,
                  110,
                ],
              },
              { kind: 'account', path: 'protocol_position' },
              { kind: 'account', path: 'payer' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        { name: 'pool_token_vault_0', writable: true },
        { name: 'pool_token_vault_1', writable: true },
        { name: 'recipient_token_account_0', writable: true },
        { name: 'recipient_token_account_1', writable: true },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        {
          name: 'memo_program',
          address: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [{ name: 'use_tickarray_bitmap_extension', type: 'bool' }],
    },
    {
      name: 'claim_trading_fee_v2',
      discriminator: [14, 191, 110, 194, 165, 87, 174, 123],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'payer', signer: true },
        {
          name: 'nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'nft_account' },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_lower_index',
                account: 'PersonalPositionState',
              },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_upper_index',
                account: 'PersonalPositionState',
              },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        { name: 'pool_personal_position', writable: true },
        { name: 'tick_array_lower', writable: true },
        { name: 'tick_array_upper', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'user_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 115, 101, 114, 95, 112, 111, 115, 105, 116, 105, 111,
                  110,
                ],
              },
              { kind: 'account', path: 'protocol_position' },
              { kind: 'account', path: 'payer' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        { name: 'pool_token_vault_0', writable: true },
        { name: 'pool_token_vault_1', writable: true },
        { name: 'recipient_token_account_0', writable: true },
        { name: 'recipient_token_account_1', writable: true },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        {
          name: 'memo_program',
          address: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [{ name: 'use_tickarray_bitmap_extension', type: 'bool' }],
    },
    {
      name: 'create_operation_config',
      discriminator: [165, 192, 160, 111, 151, 76, 206, 219],
      accounts: [
        { name: 'system', writable: true, signer: true },
        {
          name: 'operation_config',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  111, 112, 101, 114, 97, 116, 105, 111, 110, 95, 99, 111, 110,
                  102, 105, 103,
                ],
              },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [],
    },
    {
      name: 'create_system_config',
      discriminator: [238, 250, 74, 143, 28, 109, 138, 65],
      accounts: [
        { name: 'system', writable: true, signer: true },
        {
          name: 'system_config',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  115, 121, 115, 116, 101, 109, 95, 99, 111, 110, 102, 105, 103,
                ],
              },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [{ name: 'protocol_fee_rate', type: 'u32' }],
    },
    {
      name: 'decrease_liquidity',
      discriminator: [160, 38, 208, 111, 104, 91, 44, 1],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'payer', signer: true },
        {
          name: 'nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'nft_account' },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_lower_index',
                account: 'PersonalPositionState',
              },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_upper_index',
                account: 'PersonalPositionState',
              },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        { name: 'pool_personal_position', writable: true },
        { name: 'tick_array_lower', writable: true },
        { name: 'tick_array_upper', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'user_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 115, 101, 114, 95, 112, 111, 115, 105, 116, 105, 111,
                  110,
                ],
              },
              { kind: 'account', path: 'protocol_position' },
              { kind: 'account', path: 'payer' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        { name: 'pool_token_vault_0', writable: true },
        { name: 'pool_token_vault_1', writable: true },
        { name: 'recipient_token_account_0', writable: true },
        { name: 'recipient_token_account_1', writable: true },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        {
          name: 'memo_program',
          address: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [
        { name: 'liquidity', type: 'u128' },
        { name: 'amount_0_min', type: 'u64' },
        { name: 'amount_1_min', type: 'u64' },
        { name: 'use_tickarray_bitmap_extension', type: 'bool' },
      ],
    },
    {
      name: 'decrease_liquidity_v2',
      discriminator: [58, 127, 188, 62, 79, 82, 196, 96],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'payer', signer: true },
        {
          name: 'nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'nft_account' },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_lower_index',
                account: 'PersonalPositionState',
              },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_upper_index',
                account: 'PersonalPositionState',
              },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        { name: 'pool_personal_position', writable: true },
        { name: 'tick_array_lower', writable: true },
        { name: 'tick_array_upper', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'user_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 115, 101, 114, 95, 112, 111, 115, 105, 116, 105, 111,
                  110,
                ],
              },
              { kind: 'account', path: 'protocol_position' },
              { kind: 'account', path: 'payer' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        { name: 'pool_token_vault_0', writable: true },
        { name: 'pool_token_vault_1', writable: true },
        { name: 'recipient_token_account_0', writable: true },
        { name: 'recipient_token_account_1', writable: true },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        {
          name: 'memo_program',
          address: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [
        { name: 'liquidity', type: 'u128' },
        { name: 'amount_0_min', type: 'u64' },
        { name: 'amount_1_min', type: 'u64' },
        { name: 'use_tickarray_bitmap_extension', type: 'bool' },
      ],
    },
    {
      name: 'increase_liquidity',
      discriminator: [46, 156, 243, 118, 13, 205, 251, 178],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'payer', signer: true },
        {
          name: 'nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'nft_account' },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_lower_index',
                account: 'PersonalPositionState',
              },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_upper_index',
                account: 'PersonalPositionState',
              },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        { name: 'pool_personal_position', writable: true },
        { name: 'tick_array_lower', writable: true },
        { name: 'tick_array_upper', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'user_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 115, 101, 114, 95, 112, 111, 115, 105, 116, 105, 111,
                  110,
                ],
              },
              { kind: 'account', path: 'protocol_position' },
              { kind: 'account', path: 'payer' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        {
          name: 'pool_token_vault_0',
          docs: ['The address that holds pool tokens for token_0'],
          writable: true,
        },
        {
          name: 'pool_token_vault_1',
          docs: ['The address that holds pool tokens for token_1'],
          writable: true,
        },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
        { name: 'payer_token_account_0', writable: true },
        { name: 'payer_token_account_1', writable: true },
      ],
      args: [
        { name: 'liquidity', type: 'u128' },
        { name: 'amount_0', type: 'u64' },
        { name: 'amount_1', type: 'u64' },
        { name: 'amount_0_max', type: 'u64' },
        { name: 'amount_1_max', type: 'u64' },
      ],
    },
    {
      name: 'increase_liquidity_v2',
      discriminator: [133, 29, 89, 223, 69, 238, 176, 10],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'payer', signer: true },
        {
          name: 'nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'nft_account' },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_lower_index',
                account: 'PersonalPositionState',
              },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_upper_index',
                account: 'PersonalPositionState',
              },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        { name: 'pool_personal_position', writable: true },
        { name: 'tick_array_lower', writable: true },
        { name: 'tick_array_upper', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'user_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 115, 101, 114, 95, 112, 111, 115, 105, 116, 105, 111,
                  110,
                ],
              },
              { kind: 'account', path: 'protocol_position' },
              { kind: 'account', path: 'payer' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        {
          name: 'pool_token_vault_0',
          docs: ['The address that holds pool tokens for token_0'],
          writable: true,
        },
        {
          name: 'pool_token_vault_1',
          docs: ['The address that holds pool tokens for token_1'],
          writable: true,
        },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
        { name: 'payer_token_account_0', writable: true },
        { name: 'payer_token_account_1', writable: true },
      ],
      args: [
        { name: 'liquidity', type: 'u128' },
        { name: 'amount_0', type: 'u64' },
        { name: 'amount_1', type: 'u64' },
        { name: 'amount_0_max', type: 'u64' },
        { name: 'amount_1_max', type: 'u64' },
        { name: 'base_flag', type: { option: 'bool' } },
      ],
    },
    {
      name: 'initialize_protocol_position',
      discriminator: [55, 44, 157, 156, 186, 176, 233, 135],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'owner', writable: true, signer: true },
        {
          name: 'nft_account',
          pda: {
            seeds: [
              { kind: 'account', path: 'authority_position' },
              {
                kind: 'const',
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: 'account',
                path: 'pool_personal_position.nft_mint',
                account: 'PersonalPositionState',
              },
            ],
            program: {
              kind: 'const',
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        { name: 'pool_state' },
        { name: 'pool_personal_position' },
        {
          name: 'system_config',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  115, 121, 115, 116, 101, 109, 95, 99, 111, 110, 102, 105, 103,
                ],
              },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'authority_position',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'protocol_token_vault_0' },
        { name: 'protocol_token_vault_1' },
        {
          name: 'associated_token_program',
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [],
    },
    {
      name: 'initialize_user_position',
      discriminator: [231, 139, 172, 230, 252, 49, 210, 9],
      accounts: [
        { name: 'payer', writable: true, signer: true },
        { name: 'pool_state' },
        {
          name: 'protocol_position',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'user_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 115, 101, 114, 95, 112, 111, 115, 105, 116, 105, 111,
                  110,
                ],
              },
              { kind: 'account', path: 'protocol_position' },
              { kind: 'account', path: 'payer' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        { name: '_tick_lower_index', type: 'i32' },
        { name: '_tick_upper_index', type: 'i32' },
      ],
    },
    {
      name: 'proxy_initialize_protocol_position',
      discriminator: [141, 192, 207, 219, 103, 208, 249, 78],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'owner', writable: true, signer: true },
        {
          name: 'position_nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'position_nft_mint', writable: true, signer: true },
        { name: 'position_nft_account', writable: true },
        { name: 'metadata_account', writable: true },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_lower_index' },
              { kind: 'arg', path: 'tick_upper_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'tick_array_lower',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [116, 105, 99, 107, 95, 97, 114, 114, 97, 121],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_array_lower_start_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'tick_array_upper',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [116, 105, 99, 107, 95, 97, 114, 114, 97, 121],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_array_upper_start_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'pool_personal_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'position_nft_mint' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'token_account_0',
          docs: ['The token_0 account deposit token to the pool'],
          writable: true,
        },
        {
          name: 'token_account_1',
          docs: ['The token_1 account deposit token to the pool'],
          writable: true,
        },
        {
          name: 'pool_token_vault_0',
          docs: ['The address that holds pool tokens for token_0'],
          writable: true,
        },
        {
          name: 'pool_token_vault_1',
          docs: ['The address that holds pool tokens for token_1'],
          writable: true,
        },
        {
          name: 'rent',
          address: 'SysvarRent111111111111111111111111111111111',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'associated_token_program',
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        },
        {
          name: 'metadata_program',
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        { name: 'vault_0_mint' },
        { name: 'vault_1_mint' },
      ],
      args: [
        { name: 'tick_lower_index', type: 'i32' },
        { name: 'tick_upper_index', type: 'i32' },
        { name: 'tick_array_lower_start_index', type: 'i32' },
        { name: 'tick_array_upper_start_index', type: 'i32' },
      ],
    },
    {
      name: 'proxy_initialize_protocol_position_v2',
      discriminator: [213, 232, 249, 65, 105, 209, 61, 20],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'owner', writable: true, signer: true },
        {
          name: 'position_nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'position_nft_mint', writable: true, signer: true },
        { name: 'position_nft_account', writable: true },
        { name: 'metadata_account', writable: true },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_lower_index' },
              { kind: 'arg', path: 'tick_upper_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'tick_array_lower',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [116, 105, 99, 107, 95, 97, 114, 114, 97, 121],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_array_lower_start_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'tick_array_upper',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [116, 105, 99, 107, 95, 97, 114, 114, 97, 121],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_array_upper_start_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'pool_personal_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'position_nft_mint' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'token_account_0',
          docs: ['The token_0 account deposit token to the pool'],
          writable: true,
        },
        {
          name: 'token_account_1',
          docs: ['The token_1 account deposit token to the pool'],
          writable: true,
        },
        {
          name: 'pool_token_vault_0',
          docs: ['The address that holds pool tokens for token_0'],
          writable: true,
        },
        {
          name: 'pool_token_vault_1',
          docs: ['The address that holds pool tokens for token_1'],
          writable: true,
        },
        {
          name: 'rent',
          address: 'SysvarRent111111111111111111111111111111111',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'associated_token_program',
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        },
        {
          name: 'metadata_program',
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        { name: 'vault_0_mint' },
        { name: 'vault_1_mint' },
      ],
      args: [
        { name: 'tick_lower_index', type: 'i32' },
        { name: 'tick_upper_index', type: 'i32' },
        { name: 'tick_array_lower_start_index', type: 'i32' },
        { name: 'tick_array_upper_start_index', type: 'i32' },
        { name: 'with_matedata', type: 'bool' },
        { name: 'base_flag', type: { option: 'bool' } },
      ],
    },
    {
      name: 'reactivate_protocol_position',
      discriminator: [80, 39, 138, 155, 242, 229, 198, 76],
      accounts: [
        { name: 'system', writable: true, signer: true },
        { name: 'pool_state', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
      ],
      args: [],
    },
    {
      name: 'reopen_protocol_position',
      discriminator: [43, 178, 150, 244, 50, 137, 29, 22],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'system', writable: true, signer: true },
        {
          name: 'position_nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'position_nft_mint', writable: true, signer: true },
        { name: 'position_nft_account', writable: true },
        { name: 'metadata_account', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_lower_index' },
              { kind: 'arg', path: 'tick_upper_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'tick_array_lower',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [116, 105, 99, 107, 95, 97, 114, 114, 97, 121],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_array_lower_start_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'tick_array_upper',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [116, 105, 99, 107, 95, 97, 114, 114, 97, 121],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_array_upper_start_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'pool_personal_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'position_nft_mint' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'system_token_account_0',
          docs: ['The token_0 account deposit token to the pool'],
          writable: true,
        },
        {
          name: 'system_token_account_1',
          docs: ['The token_1 account deposit token to the pool'],
          writable: true,
        },
        {
          name: 'pool_token_vault_0',
          docs: ['The address that holds pool tokens for token_0'],
          writable: true,
        },
        {
          name: 'pool_token_vault_1',
          docs: ['The address that holds pool tokens for token_1'],
          writable: true,
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        {
          name: 'rent',
          address: 'SysvarRent111111111111111111111111111111111',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'associated_token_program',
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        },
        {
          name: 'metadata_program',
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        { name: 'vault_0_mint' },
        { name: 'vault_1_mint' },
      ],
      args: [
        { name: 'tick_lower_index', type: 'i32' },
        { name: 'tick_upper_index', type: 'i32' },
        { name: 'tick_array_lower_start_index', type: 'i32' },
        { name: 'tick_array_upper_start_index', type: 'i32' },
        { name: 'liquidity', type: 'u128' },
        { name: 'amount_0_max', type: 'u64' },
        { name: 'amount_1_max', type: 'u64' },
      ],
    },
    {
      name: 'reopen_protocol_position_v2',
      discriminator: [81, 78, 197, 149, 85, 156, 58, 91],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'system', writable: true, signer: true },
        {
          name: 'position_nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'position_nft_mint', writable: true, signer: true },
        { name: 'position_nft_account', writable: true },
        { name: 'metadata_account', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_lower_index' },
              { kind: 'arg', path: 'tick_upper_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'tick_array_lower',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [116, 105, 99, 107, 95, 97, 114, 114, 97, 121],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_array_lower_start_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'tick_array_upper',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [116, 105, 99, 107, 95, 97, 114, 114, 97, 121],
              },
              { kind: 'account', path: 'pool_state' },
              { kind: 'arg', path: 'tick_array_upper_start_index' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'pool_personal_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'position_nft_mint' },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        {
          name: 'system_token_account_0',
          docs: ['The token_0 account deposit token to the pool'],
          writable: true,
        },
        {
          name: 'system_token_account_1',
          docs: ['The token_1 account deposit token to the pool'],
          writable: true,
        },
        {
          name: 'pool_token_vault_0',
          docs: ['The address that holds pool tokens for token_0'],
          writable: true,
        },
        {
          name: 'pool_token_vault_1',
          docs: ['The address that holds pool tokens for token_1'],
          writable: true,
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        {
          name: 'rent',
          address: 'SysvarRent111111111111111111111111111111111',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'associated_token_program',
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        },
        {
          name: 'metadata_program',
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        { name: 'vault_0_mint' },
        { name: 'vault_1_mint' },
      ],
      args: [
        { name: 'tick_lower_index', type: 'i32' },
        { name: 'tick_upper_index', type: 'i32' },
        { name: 'tick_array_lower_start_index', type: 'i32' },
        { name: 'tick_array_upper_start_index', type: 'i32' },
        { name: 'liquidity', type: 'u128' },
        { name: 'amount_0_max', type: 'u64' },
        { name: 'amount_1_max', type: 'u64' },
        { name: 'with_matedata', type: 'bool' },
        { name: 'base_flag', type: { option: 'bool' } },
      ],
    },
    {
      name: 'swap_liquidity',
      discriminator: [95, 66, 115, 115, 206, 52, 200, 206],
      accounts: [
        { name: 'system', writable: true, signer: true },
        { name: 'pool_state' },
        {
          name: 'authority_position',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'system_token_vault_0' },
        { name: 'system_token_vault_1' },
        {
          name: 'jupiter_program',
          address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [{ name: 'data', type: 'bytes' }],
    },
    {
      name: 'swap_liquidity_dev',
      discriminator: [181, 190, 13, 255, 151, 104, 43, 110],
      accounts: [
        { name: 'system', writable: true, signer: true },
        { name: 'pool_state' },
        {
          name: 'authority_position',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'system_token_vault_0' },
        { name: 'system_token_vault_1' },
        {
          name: 'jupiter_program',
          address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [
        { name: 'is_base', type: 'bool' },
        { name: 'swap_amount', type: 'u64' },
        { name: 'receive_amount', type: 'u64' },
      ],
    },
    {
      name: 'system_transfer_remaining_amount',
      discriminator: [19, 2, 16, 91, 47, 163, 140, 168],
      accounts: [
        { name: 'system', writable: true, signer: true },
        { name: 'recipient', writable: true },
        { name: 'pool_state' },
        {
          name: 'authority_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'protocol_token_account_0', writable: true },
        { name: 'protocol_token_account_1', writable: true },
        { name: 'recipient_token_account_0', writable: true },
        { name: 'recipient_token_account_1', writable: true },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
      ],
      args: [
        { name: 'amount_0', type: 'u64' },
        { name: 'amount_1', type: 'u64' },
      ],
    },
    {
      name: 'system_withdraw_liquidity',
      discriminator: [94, 30, 22, 45, 28, 23, 142, 33],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'system', writable: true, signer: true },
        {
          name: 'nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'nft_account' },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_lower_index',
                account: 'PersonalPositionState',
              },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_upper_index',
                account: 'PersonalPositionState',
              },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        { name: 'pool_personal_position', writable: true },
        { name: 'tick_array_lower', writable: true },
        { name: 'tick_array_upper', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'system_token_account_0', writable: true },
        { name: 'system_token_account_1', writable: true },
        { name: 'pool_token_vault_0', writable: true },
        { name: 'pool_token_vault_1', writable: true },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        {
          name: 'memo_program',
          address: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [
        { name: 'use_tickarray_bitmap_extension', type: 'bool' },
        { name: 'amount_0_min', type: 'u64' },
        { name: 'amount_1_min', type: 'u64' },
      ],
    },
    {
      name: 'system_withdraw_liquidity_v2',
      discriminator: [117, 5, 158, 76, 215, 174, 236, 13],
      accounts: [
        {
          name: 'clmm_program',
          address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
        },
        { name: 'system', writable: true, signer: true },
        {
          name: 'nft_owner',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  97, 117, 116, 104, 111, 114, 105, 116, 121, 95, 112, 111, 115,
                  105, 116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'nft_account' },
        { name: 'pool_state', writable: true },
        {
          name: 'pool_protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [112, 111, 115, 105, 116, 105, 111, 110],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_lower_index',
                account: 'PersonalPositionState',
              },
              {
                kind: 'account',
                path: 'pool_personal_position.tick_upper_index',
                account: 'PersonalPositionState',
              },
            ],
            program: { kind: 'account', path: 'clmm_program' },
          },
        },
        { name: 'pool_personal_position', writable: true },
        { name: 'tick_array_lower', writable: true },
        { name: 'tick_array_upper', writable: true },
        {
          name: 'protocol_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        { name: 'system_token_account_0', writable: true },
        { name: 'system_token_account_1', writable: true },
        { name: 'pool_token_vault_0', writable: true },
        { name: 'pool_token_vault_1', writable: true },
        {
          name: 'token_program',
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          name: 'token_program_2022',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
        {
          name: 'memo_program',
          address: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
        },
        { name: 'token_0_mint' },
        { name: 'token_1_mint' },
      ],
      args: [
        { name: 'use_tickarray_bitmap_extension', type: 'bool' },
        { name: 'amount_0_min', type: 'u64' },
        { name: 'amount_1_min', type: 'u64' },
      ],
    },
    {
      name: 'update_operation_config',
      discriminator: [249, 70, 75, 133, 232, 109, 80, 217],
      accounts: [
        { name: 'system', writable: true, signer: true },
        {
          name: 'operation_config',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  111, 112, 101, 114, 97, 116, 105, 111, 110, 95, 99, 111, 110,
                  102, 105, 103,
                ],
              },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
      ],
      args: [
        { name: 'action', type: 'u8' },
        { name: 'keys', type: { vec: 'pubkey' } },
      ],
    },
    {
      name: 'update_system_config',
      discriminator: [173, 151, 172, 94, 29, 47, 28, 132],
      accounts: [
        { name: 'system', writable: true, signer: true },
        {
          name: 'system_config',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  115, 121, 115, 116, 101, 109, 95, 99, 111, 110, 102, 105, 103,
                ],
              },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
      ],
      args: [{ name: 'protocol_fee_rate', type: { option: 'u32' } }],
    },
    {
      name: 'update_user_position',
      discriminator: [55, 141, 157, 156, 105, 153, 183, 153],
      accounts: [
        { name: 'system', writable: true, signer: true },
        { name: 'user' },
        { name: 'pool_state' },
        {
          name: 'protocol_position',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  112, 114, 111, 116, 111, 99, 111, 108, 95, 112, 111, 115, 105,
                  116, 105, 111, 110,
                ],
              },
              { kind: 'account', path: 'pool_state' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
        {
          name: 'user_position',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 115, 101, 114, 95, 112, 111, 115, 105, 116, 105, 111,
                  110,
                ],
              },
              { kind: 'account', path: 'protocol_position' },
              { kind: 'account', path: 'user' },
              {
                kind: 'const',
                value: [
                  21, 24, 54, 244, 252, 223, 91, 164, 4, 220, 91, 185, 92, 205,
                  69, 62, 143, 235, 70, 219, 193, 127, 124, 57, 183, 227, 214,
                  233, 25, 106, 73, 92,
                ],
              },
            ],
          },
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'AuthorityPosition',
      discriminator: [239, 140, 4, 43, 103, 88, 126, 154],
    },
    {
      name: 'OperationConfig',
      discriminator: [69, 20, 34, 3, 68, 101, 44, 52],
    },
    {
      name: 'PersonalPositionState',
      discriminator: [70, 111, 150, 126, 230, 15, 25, 117],
    },
    {
      name: 'PoolState',
      discriminator: [247, 237, 227, 245, 215, 195, 222, 70],
    },
    {
      name: 'ProtocolPosition',
      discriminator: [244, 162, 101, 37, 23, 60, 213, 57],
    },
    {
      name: 'ProtocolPositionState',
      discriminator: [100, 226, 145, 99, 146, 218, 160, 106],
    },
    {
      name: 'SystemConfig',
      discriminator: [218, 150, 16, 126, 102, 185, 75, 1],
    },
    {
      name: 'TickArrayState',
      discriminator: [192, 155, 85, 205, 49, 249, 129, 42],
    },
    {
      name: 'UserPosition',
      discriminator: [251, 248, 209, 245, 83, 234, 17, 27],
    },
  ],
  events: [
    {
      name: 'SystemInitializePositionEvent',
      discriminator: [237, 220, 145, 178, 70, 40, 111, 47],
    },
    {
      name: 'SystemProxyInitializePositionEvent',
      discriminator: [144, 199, 163, 254, 193, 235, 10, 124],
    },
    {
      name: 'SystemReactivatePositionEvent',
      discriminator: [217, 145, 117, 20, 198, 113, 25, 135],
    },
    {
      name: 'SystemReopenPositionEvent',
      discriminator: [137, 53, 83, 1, 231, 251, 218, 33],
    },
    {
      name: 'SystemSwapLiquidityEvent',
      discriminator: [14, 20, 19, 5, 244, 110, 196, 84],
    },
    {
      name: 'SystemUpdateUserPositionEvent',
      discriminator: [221, 48, 77, 143, 91, 73, 189, 241],
    },
    {
      name: 'SystemWithdrawLiquidityEvent',
      discriminator: [246, 161, 58, 74, 198, 76, 51, 198],
    },
    {
      name: 'UserClaimFeeEvent',
      discriminator: [193, 172, 212, 18, 54, 46, 47, 68],
    },
    {
      name: 'UserDepositLiquidityEvent',
      discriminator: [157, 18, 196, 253, 20, 70, 22, 80],
    },
    {
      name: 'UserOpenPositionEvent',
      discriminator: [234, 66, 36, 71, 195, 93, 84, 222],
    },
    {
      name: 'UserWithdrawLiquidityEvent',
      discriminator: [61, 71, 141, 165, 73, 49, 167, 13],
    },
  ],
  errors: [
    { code: 6000, name: 'NotApproved', msg: 'Not approved' },
    { code: 6001, name: 'InvalidSystemKey', msg: 'Invalid system key' },
    {
      code: 6002,
      name: 'InvalidUpdateOperationConfigFlag',
      msg: 'invalid update operation config flag',
    },
    {
      code: 6003,
      name: 'InvalidSystemConfig',
      msg: 'Invalid system config',
    },
    {
      code: 6004,
      name: 'InvalidDepositUserPositionFlag',
      msg: 'Invalid deposit user position flag',
    },
    {
      code: 6005,
      name: 'PriceSlippageCheck',
      msg: 'Price slippage check',
    },
    {
      code: 6006,
      name: 'InsufficientLiquidity',
      msg: 'Insufficient liquidity',
    },
    {
      code: 6007,
      name: 'ArithmeticOverflow',
      msg: 'Arithmetic overflow',
    },
    {
      code: 6008,
      name: 'ProtocolPositionNotActive',
      msg: 'Protocol position not active',
    },
    {
      code: 6009,
      name: 'ProtocolPositionIsNotRebalancing',
      msg: 'Protocol position is not Rebalancing',
    },
    {
      code: 6010,
      name: 'InvalidRewardInputAccountNumber',
      msg: 'Invalid collect reward input account number',
    },
    {
      code: 6011,
      name: 'InvalidRewardInputAccountOwner',
      msg: 'Invalid collect reward input account owner',
    },
    {
      code: 6012,
      name: 'ProtocolPositionNotInRebalancingProcess',
      msg: 'Protocol position not in rebalancing process',
    },
    {
      code: 6013,
      name: 'NewLiquidityHadExceedLimit',
      msg: 'New liquidity had exceed limit',
    },
    {
      code: 6014,
      name: 'ConflictVersionPosition',
      msg: 'Conflict version position',
    },
  ],
  types: [
    { name: 'AuthorityPosition', type: { kind: 'struct', fields: [] } },
    {
      name: 'OperationConfig',
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', type: 'u8' },
          { name: 'operators', type: { array: ['pubkey', 10] } },
        ],
      },
    },
    {
      name: 'PersonalPositionState',
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', docs: ['Bump to identify PDA'], type: 'u8' },
          {
            name: 'nft_mint',
            docs: ['Mint address of the tokenized position'],
            type: 'pubkey',
          },
          {
            name: 'pool_id',
            docs: ['The ID of the pool with which this token is connected'],
            type: 'pubkey',
          },
          {
            name: 'tick_lower_index',
            docs: ['The lower bound tick of the position'],
            type: 'i32',
          },
          {
            name: 'tick_upper_index',
            docs: ['The upper bound tick of the position'],
            type: 'i32',
          },
          {
            name: 'liquidity',
            docs: ['The amount of liquidity owned by this position'],
            type: 'u128',
          },
          {
            name: 'fee_growth_inside_0_last_x64',
            docs: [
              'The token_0 fee growth of the aggregate position as of the last action on the individual position',
            ],
            type: 'u128',
          },
          {
            name: 'fee_growth_inside_1_last_x64',
            docs: [
              'The token_1 fee growth of the aggregate position as of the last action on the individual position',
            ],
            type: 'u128',
          },
          {
            name: 'token_fees_owed_0',
            docs: [
              'The fees owed to the position owner in token_0, as of the last computation',
            ],
            type: 'u64',
          },
          {
            name: 'token_fees_owed_1',
            docs: [
              'The fees owed to the position owner in token_1, as of the last computation',
            ],
            type: 'u64',
          },
          {
            name: 'reward_infos',
            type: {
              array: [
                {
                  defined: {
                    name: 'raydium_clmm_cpi::states::PositionRewardInfo',
                  },
                },
                3,
              ],
            },
          },
          { name: 'padding', type: { array: ['u64', 8] } },
        ],
      },
    },
    {
      name: 'PoolState',
      docs: [
        'The pool state',
        '',
        'PDA of `[POOL_SEED, config, token_mint_0, token_mint_1]`',
        '',
      ],
      serialization: 'bytemuckunsafe',
      repr: { kind: 'c', packed: true },
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            docs: ['Bump to identify PDA'],
            type: { array: ['u8', 1] },
          },
          { name: 'amm_config', type: 'pubkey' },
          { name: 'owner', type: 'pubkey' },
          {
            name: 'token_mint_0',
            docs: [
              'Token pair of the pool, where token_mint_0 address < token_mint_1 address',
            ],
            type: 'pubkey',
          },
          { name: 'token_mint_1', type: 'pubkey' },
          {
            name: 'token_vault_0',
            docs: ['Token pair vault'],
            type: 'pubkey',
          },
          { name: 'token_vault_1', type: 'pubkey' },
          {
            name: 'observation_key',
            docs: ['observation account key'],
            type: 'pubkey',
          },
          {
            name: 'mint_decimals_0',
            docs: ['mint0 and mint1 decimals'],
            type: 'u8',
          },
          { name: 'mint_decimals_1', type: 'u8' },
          {
            name: 'tick_spacing',
            docs: ['The minimum number of ticks between initialized ticks'],
            type: 'u16',
          },
          {
            name: 'liquidity',
            docs: ['The currently in range liquidity available to the pool.'],
            type: 'u128',
          },
          {
            name: 'sqrt_price_x64',
            docs: [
              'The current price of the pool as a sqrt(token_1/token_0) Q64.64 value',
            ],
            type: 'u128',
          },
          {
            name: 'tick_current',
            docs: [
              'The current tick of the pool, i.e. according to the last tick transition that was run.',
            ],
            type: 'i32',
          },
          {
            name: 'observation_index',
            docs: ['the most-recently updated index of the observations array'],
            type: 'u16',
          },
          { name: 'observation_update_duration', type: 'u16' },
          {
            name: 'fee_growth_global_0_x64',
            docs: [
              'The fee growth as a Q64.64 number, i.e. fees of token_0 and token_1 collected per',
              'unit of liquidity for the entire life of the pool.',
            ],
            type: 'u128',
          },
          { name: 'fee_growth_global_1_x64', type: 'u128' },
          {
            name: 'protocol_fees_token_0',
            docs: [
              'The amounts of token_0 and token_1 that are owed to the protocol.',
            ],
            type: 'u64',
          },
          { name: 'protocol_fees_token_1', type: 'u64' },
          {
            name: 'swap_in_amount_token_0',
            docs: ['The amounts in and out of swap token_0 and token_1'],
            type: 'u128',
          },
          { name: 'swap_out_amount_token_1', type: 'u128' },
          { name: 'swap_in_amount_token_1', type: 'u128' },
          { name: 'swap_out_amount_token_0', type: 'u128' },
          {
            name: 'status',
            docs: [
              'Bitwise representation of the state of the pool',
              'bit0, 1: disable open position and increase liquidity, 0: normal',
              'bit1, 1: disable decrease liquidity, 0: normal',
              'bit2, 1: disable collect fee, 0: normal',
              'bit3, 1: disable collect reward, 0: normal',
              'bit4, 1: disable swap, 0: normal',
            ],
            type: 'u8',
          },
          {
            name: 'padding',
            docs: ['Leave blank for future use'],
            type: { array: ['u8', 7] },
          },
          {
            name: 'reward_infos',
            type: { array: [{ defined: { name: 'RewardInfo' } }, 3] },
          },
          {
            name: 'tick_array_bitmap',
            docs: ['Packed initialized tick array state'],
            type: { array: ['u64', 16] },
          },
          {
            name: 'total_fees_token_0',
            docs: ['except protocol_fee and fund_fee'],
            type: 'u64',
          },
          {
            name: 'total_fees_claimed_token_0',
            docs: ['except protocol_fee and fund_fee'],
            type: 'u64',
          },
          { name: 'total_fees_token_1', type: 'u64' },
          { name: 'total_fees_claimed_token_1', type: 'u64' },
          { name: 'fund_fees_token_0', type: 'u64' },
          { name: 'fund_fees_token_1', type: 'u64' },
          { name: 'open_time', type: 'u64' },
          { name: 'padding1', type: { array: ['u64', 25] } },
          { name: 'padding2', type: { array: ['u64', 32] } },
        ],
      },
    },
    {
      name: 'ProtocolPosition',
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', type: 'u8' },
          { name: 'system_config', type: 'pubkey' },
          { name: 'position_mint', type: 'pubkey' },
          { name: 'pool_address', type: 'pubkey' },
          { name: 'tick_lower_index', type: 'i32' },
          { name: 'tick_upper_index', type: 'i32' },
          { name: 'liquidity', type: 'u128' },
          { name: 'fee_growth_inside_0', type: 'u128' },
          { name: 'fee_growth_inside_1', type: 'u128' },
          { name: 'amount_0_reserve', type: 'u64' },
          { name: 'amount_1_reserve', type: 'u64' },
          { name: 'token_vault_0', type: 'pubkey' },
          { name: 'token_vault_1', type: 'pubkey' },
          {
            name: 'reward_infos',
            type: {
              array: [
                {
                  defined: {
                    name: 'ensofi_liquidity::states::protocol_position::PositionRewardInfo',
                  },
                },
                3,
              ],
            },
          },
          { name: 'recent_epoch', type: 'u64' },
          { name: 'authority_position', type: 'pubkey' },
          {
            name: 'status',
            type: { defined: { name: 'ProtocolPositionStatus' } },
          },
          { name: 'version', type: 'u64' },
          { name: 'old_liquidity', type: 'u128' },
          { name: 'padding', type: { array: ['u64', 4] } },
        ],
      },
    },
    {
      name: 'ProtocolPositionState',
      docs: ["Info stored for each user's position"],
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', docs: ['Bump to identify PDA'], type: 'u8' },
          {
            name: 'pool_id',
            docs: ['The ID of the pool with which this token is connected'],
            type: 'pubkey',
          },
          {
            name: 'tick_lower_index',
            docs: ['The lower bound tick of the position'],
            type: 'i32',
          },
          {
            name: 'tick_upper_index',
            docs: ['The upper bound tick of the position'],
            type: 'i32',
          },
          {
            name: 'liquidity',
            docs: ['The amount of liquidity owned by this position'],
            type: 'u128',
          },
          {
            name: 'fee_growth_inside_0_last_x64',
            docs: [
              'The token_0 fee growth per unit of liquidity as of the last update to liquidity or fees owed',
            ],
            type: 'u128',
          },
          {
            name: 'fee_growth_inside_1_last_x64',
            docs: [
              'The token_1 fee growth per unit of liquidity as of the last update to liquidity or fees owed',
            ],
            type: 'u128',
          },
          {
            name: 'token_fees_owed_0',
            docs: ['The fees owed to the position owner in token_0'],
            type: 'u64',
          },
          {
            name: 'token_fees_owed_1',
            docs: ['The fees owed to the position owner in token_1'],
            type: 'u64',
          },
          {
            name: 'reward_growth_inside',
            docs: [
              'The reward growth per unit of liquidity as of the last update to liquidity',
            ],
            type: { array: ['u128', 3] },
          },
          { name: 'padding', type: { array: ['u64', 8] } },
        ],
      },
    },
    {
      name: 'ProtocolPositionStatus',
      type: {
        kind: 'enum',
        variants: [
          { name: 'Active' },
          { name: 'ReBalancing' },
          { name: 'ReOpened' },
        ],
      },
    },
    {
      name: 'RewardInfo',
      serialization: 'bytemuckunsafe',
      repr: { kind: 'c', packed: true },
      type: {
        kind: 'struct',
        fields: [
          { name: 'reward_state', docs: ['Reward state'], type: 'u8' },
          { name: 'open_time', docs: ['Reward open time'], type: 'u64' },
          { name: 'end_time', docs: ['Reward end time'], type: 'u64' },
          {
            name: 'last_update_time',
            docs: ['Reward last update time'],
            type: 'u64',
          },
          {
            name: 'emissions_per_second_x64',
            docs: [
              'Q64.64 number indicates how many tokens per second are earned per unit of liquidity.',
            ],
            type: 'u128',
          },
          {
            name: 'reward_total_emissioned',
            docs: ['The total amount of reward emissioned'],
            type: 'u64',
          },
          {
            name: 'reward_claimed',
            docs: ['The total amount of claimed reward'],
            type: 'u64',
          },
          {
            name: 'token_mint',
            docs: ['Reward token mint.'],
            type: 'pubkey',
          },
          {
            name: 'token_vault',
            docs: ['Reward vault token account.'],
            type: 'pubkey',
          },
          {
            name: 'authority',
            docs: ['The owner that has permission to set reward param'],
            type: 'pubkey',
          },
          {
            name: 'reward_growth_global_x64',
            docs: [
              'Q64.64 number that tracks the total tokens earned per unit of liquidity since the reward',
              'emissions were turned on.',
            ],
            type: 'u128',
          },
        ],
      },
    },
    {
      name: 'SystemConfig',
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', type: 'u8' },
          { name: 'owner', type: 'pubkey' },
          { name: 'protocol_fee_rate', type: 'u32' },
        ],
      },
    },
    {
      name: 'SystemInitializePositionEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'lp_platform', type: 'string' },
          { name: 'nft_mint', type: 'pubkey' },
          { name: 'pool_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'token_0_address', type: 'pubkey' },
          { name: 'token_1_address', type: 'pubkey' },
          { name: 'liquidity', type: 'u128' },
          { name: 'tick_lower_index', type: 'i32' },
          { name: 'tick_upper_index', type: 'i32' },
        ],
      },
    },
    {
      name: 'SystemProxyInitializePositionEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'lp_platform', type: 'string' },
          { name: 'nft_mint', type: 'pubkey' },
          { name: 'pool_address', type: 'pubkey' },
          { name: 'token_0_address', type: 'pubkey' },
          { name: 'token_1_address', type: 'pubkey' },
          { name: 'liquidity', type: 'u128' },
          { name: 'tick_lower_index', type: 'i32' },
          { name: 'tick_upper_index', type: 'i32' },
        ],
      },
    },
    {
      name: 'SystemReactivatePositionEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
        ],
      },
    },
    {
      name: 'SystemReopenPositionEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'lp_platform', type: 'string' },
          { name: 'nft_mint', type: 'pubkey' },
          { name: 'pool_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'token_0_address', type: 'pubkey' },
          { name: 'token_1_address', type: 'pubkey' },
          { name: 'liquidity', type: 'u128' },
          { name: 'old_liquidity', type: 'u128' },
          { name: 'tick_lower_index', type: 'i32' },
          { name: 'tick_upper_index', type: 'i32' },
          {
            name: 'status',
            type: { defined: { name: 'ProtocolPositionStatus' } },
          },
          { name: 'reserve_0_amount', type: 'u64' },
          { name: 'reserve_1_amount', type: 'u64' },
          { name: 'version', type: 'u64' },
        ],
      },
    },
    {
      name: 'SystemSwapLiquidityEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'token_swap', type: 'pubkey' },
          { name: 'swap_amount', type: 'u64' },
          { name: 'receive_amount', type: 'u64' },
          { name: 'reserve_0_amount', type: 'u64' },
          { name: 'reserve_1_amount', type: 'u64' },
        ],
      },
    },
    {
      name: 'SystemUpdateUserPositionEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_address', type: 'pubkey' },
          { name: 'new_liquidity', type: 'u128' },
          { name: 'old_liquidity', type: 'u128' },
          { name: 'wallet_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'user_position_address', type: 'pubkey' },
        ],
      },
    },
    {
      name: 'SystemWithdrawLiquidityEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_address', type: 'pubkey' },
          { name: 'withdraw_liquidity', type: 'u128' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'reserve_0_amount', type: 'u64' },
          { name: 'reserve_1_amount', type: 'u64' },
          {
            name: 'status',
            type: { defined: { name: 'ProtocolPositionStatus' } },
          },
        ],
      },
    },
    {
      name: 'TickArrayState',
      serialization: 'bytemuckunsafe',
      repr: { kind: 'c', packed: true },
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_id', type: 'pubkey' },
          { name: 'start_tick_index', type: 'i32' },
          {
            name: 'ticks',
            type: { array: [{ defined: { name: 'TickState' } }, 60] },
          },
          { name: 'initialized_tick_count', type: 'u8' },
          { name: 'padding', type: { array: ['u8', 115] } },
        ],
      },
    },
    {
      name: 'TickState',
      serialization: 'bytemuckunsafe',
      repr: { kind: 'c', packed: true },
      type: {
        kind: 'struct',
        fields: [
          { name: 'tick', type: 'i32' },
          {
            name: 'liquidity_net',
            docs: [
              'Amount of net liquidity added (subtracted) when tick is crossed from left to right (right to left)',
            ],
            type: 'i128',
          },
          {
            name: 'liquidity_gross',
            docs: ['The total position liquidity that references this tick'],
            type: 'u128',
          },
          {
            name: 'fee_growth_outside_0_x64',
            docs: [
              'Fee growth per unit of liquidity on the _other_ side of this tick (relative to the current tick)',
              'only has relative meaning, not absolute — the value depends on when the tick is initialized',
            ],
            type: 'u128',
          },
          { name: 'fee_growth_outside_1_x64', type: 'u128' },
          {
            name: 'reward_growths_outside_x64',
            type: { array: ['u128', 3] },
          },
          { name: 'padding', type: { array: ['u32', 13] } },
        ],
      },
    },
    {
      name: 'UserClaimFeeEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_address', type: 'pubkey' },
          { name: 'liquidity', type: 'u128' },
          { name: 'wallet_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'user_position_address', type: 'pubkey' },
          { name: 'fee_amount_0', type: 'u64' },
          { name: 'fee_amount_1', type: 'u64' },
          { name: 'fee_claimed_0', type: 'u64' },
          { name: 'fee_claimed_1', type: 'u64' },
        ],
      },
    },
    {
      name: 'UserDepositLiquidityEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_address', type: 'pubkey' },
          { name: 'deposit_liquidity', type: 'u128' },
          { name: 'wallet_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'user_position_address', type: 'pubkey' },
          { name: 'deposit_amount_0', type: 'u64' },
          { name: 'deposit_amount_1', type: 'u64' },
        ],
      },
    },
    {
      name: 'UserOpenPositionEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_address', type: 'pubkey' },
          { name: 'liquidity', type: 'u128' },
          { name: 'wallet_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'user_position_address', type: 'pubkey' },
          { name: 'deposit_amount_0', type: 'u64' },
          { name: 'deposit_amount_1', type: 'u64' },
        ],
      },
    },
    {
      name: 'UserPosition',
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', type: 'u8' },
          { name: 'protocol_position', type: 'pubkey' },
          { name: 'owner', type: 'pubkey' },
          { name: 'liquidity', type: 'u128' },
          { name: 'fee_growth_inside_0', type: 'u128' },
          { name: 'fee_growth_inside_1', type: 'u128' },
          { name: 'token_fee_owed_0', type: 'u64' },
          { name: 'token_fee_owed_1', type: 'u64' },
          { name: 'token_fee_claimed_0', type: 'u64' },
          { name: 'token_fee_claimed_1', type: 'u64' },
          { name: 'version', type: 'u64' },
          { name: 'padding', type: { array: ['u64', 6] } },
        ],
      },
    },
    {
      name: 'UserWithdrawLiquidityEvent',
      type: {
        kind: 'struct',
        fields: [
          { name: 'pool_address', type: 'pubkey' },
          { name: 'withdraw_liquidity', type: 'u128' },
          { name: 'wallet_address', type: 'pubkey' },
          { name: 'protocol_position_address', type: 'pubkey' },
          { name: 'user_position_address', type: 'pubkey' },
          { name: 'withdraw_amount_0', type: 'u64' },
          { name: 'withdraw_amount_1', type: 'u64' },
        ],
      },
    },
    {
      name: 'ensofi_liquidity::states::protocol_position::PositionRewardInfo',
      type: {
        kind: 'struct',
        fields: [
          { name: 'reward_growth_inside', type: 'u128' },
          { name: 'reward_amount_owed', type: 'u64' },
          { name: 'reward_vault', type: { option: 'pubkey' } },
        ],
      },
    },
    {
      name: 'raydium_clmm_cpi::states::PositionRewardInfo',
      type: {
        kind: 'struct',
        fields: [
          { name: 'growth_inside_last_x64', type: 'u128' },
          { name: 'reward_amount_owed', type: 'u64' },
        ],
      },
    },
  ],
};
