export const mineIdl = {
  version: '5.0.2',
  name: 'quarry_mine',
  instructions: [
    {
      name: 'newRewarder',
      accounts: [
        {
          name: 'base',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'rewarder',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Rewarder',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'base',
              },
            ],
          },
        },
        {
          name: 'initialAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unusedAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mintWrapper',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'claimFeeTokenAccount',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'newRewarderV2',
      accounts: [
        {
          name: 'base',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'rewarder',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Rewarder',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'base',
              },
            ],
          },
        },
        {
          name: 'initialAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mintWrapper',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'claimFeeTokenAccount',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'setPauseAuthority',
      accounts: [
        {
          name: 'auth',
          accounts: [
            {
              name: 'authority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'rewarder',
              isMut: !0,
              isSigner: !1,
            },
          ],
        },
        {
          name: 'newPauseAuthority',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'pause',
      accounts: [
        {
          name: 'pauseAuthority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'rewarder',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'unpause',
      accounts: [
        {
          name: 'pauseAuthority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'rewarder',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'transferAuthority',
      accounts: [
        {
          name: 'authority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'rewarder',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'newAuthority',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'acceptAuthority',
      accounts: [
        {
          name: 'authority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'rewarder',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'setAnnualRewards',
      accounts: [
        {
          name: 'auth',
          accounts: [
            {
              name: 'authority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'rewarder',
              isMut: !0,
              isSigner: !1,
            },
          ],
        },
      ],
      args: [
        {
          name: 'newRate',
          type: 'u64',
        },
      ],
    },
    {
      name: 'createQuarry',
      accounts: [
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Quarry',
              },
              {
                kind: 'account',
                type: {
                  defined: "Account<'info,Rewarder>",
                },
                account: 'MutableRewarderWithAuthority',
                path: 'auth.rewarder',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'token_mint',
              },
            ],
          },
        },
        {
          name: 'auth',
          accounts: [
            {
              name: 'authority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'rewarder',
              isMut: !0,
              isSigner: !1,
            },
          ],
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'unusedAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'createQuarryV2',
      accounts: [
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Quarry',
              },
              {
                kind: 'account',
                type: {
                  defined: "Account<'info,Rewarder>",
                },
                account: 'MutableRewarderWithAuthority',
                path: 'auth.rewarder',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'token_mint',
              },
            ],
          },
        },
        {
          name: 'auth',
          accounts: [
            {
              name: 'authority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'rewarder',
              isMut: !0,
              isSigner: !1,
            },
          ],
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'setRewardsShare',
      accounts: [
        {
          name: 'auth',
          accounts: [
            {
              name: 'authority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'rewarder',
              isMut: !0,
              isSigner: !1,
            },
          ],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'newShare',
          type: 'u64',
        },
      ],
    },
    {
      name: 'setFamine',
      accounts: [
        {
          name: 'auth',
          accounts: [
            {
              name: 'authority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'rewarder',
              isMut: !1,
              isSigner: !1,
            },
          ],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'famineTs',
          type: 'i64',
        },
      ],
    },
    {
      name: 'updateQuarryRewards',
      accounts: [
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'createMiner',
      accounts: [
        {
          name: 'authority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Miner',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Quarry',
                path: 'quarry',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'authority',
              },
            ],
          },
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'minerVault',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'createMinerV2',
      accounts: [
        {
          name: 'authority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Miner',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Quarry',
                path: 'quarry',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'authority',
              },
            ],
          },
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'minerVault',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'claimRewards',
      accounts: [
        {
          name: 'mintWrapper',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintWrapperProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'minter',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'claimFeeTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'claim',
          accounts: [
            {
              name: 'authority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'miner',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'quarry',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'unusedMinerVault',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'unusedTokenAccount',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'tokenProgram',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'rewarder',
              isMut: !1,
              isSigner: !1,
            },
          ],
        },
      ],
      args: [],
    },
    {
      name: 'claimRewardsV2',
      accounts: [
        {
          name: 'mintWrapper',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintWrapperProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'minter',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'claimFeeTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'claim',
          accounts: [
            {
              name: 'authority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'miner',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'quarry',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'tokenProgram',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'rewarder',
              isMut: !1,
              isSigner: !1,
            },
          ],
        },
      ],
      args: [],
    },
    {
      name: 'stakeTokens',
      accounts: [
        {
          name: 'authority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'withdrawTokens',
      accounts: [
        {
          name: 'authority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'rescueTokens',
      accounts: [
        {
          name: 'miner',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'authority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'minerTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'destinationTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'extractFees',
      accounts: [
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'claimFeeTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'feeToTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'Rewarder',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'base',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'pendingAuthority',
            type: 'publicKey',
          },
          {
            name: 'numQuarries',
            type: 'u16',
          },
          {
            name: 'annualRewardsRate',
            type: 'u64',
          },
          {
            name: 'totalRewardsShares',
            type: 'u64',
          },
          {
            name: 'mintWrapper',
            type: 'publicKey',
          },
          {
            name: 'rewardsTokenMint',
            type: 'publicKey',
          },
          {
            name: 'claimFeeTokenAccount',
            type: 'publicKey',
          },
          {
            name: 'maxClaimFeeMillibps',
            type: 'u64',
          },
          {
            name: 'pauseAuthority',
            type: 'publicKey',
          },
          {
            name: 'isPaused',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'Quarry',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'rewarder',
            type: 'publicKey',
          },
          {
            name: 'tokenMintKey',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'index',
            type: 'u16',
          },
          {
            name: 'tokenMintDecimals',
            type: 'u8',
          },
          {
            name: 'famineTs',
            type: 'i64',
          },
          {
            name: 'lastUpdateTs',
            type: 'i64',
          },
          {
            name: 'rewardsPerTokenStored',
            type: 'u128',
          },
          {
            name: 'annualRewardsRate',
            type: 'u64',
          },
          {
            name: 'rewardsShare',
            type: 'u64',
          },
          {
            name: 'totalTokensDeposited',
            type: 'u64',
          },
          {
            name: 'numMiners',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'Miner',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'quarry',
            type: 'publicKey',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'tokenVaultKey',
            type: 'publicKey',
          },
          {
            name: 'rewardsEarned',
            type: 'u64',
          },
          {
            name: 'rewardsPerTokenPaid',
            type: 'u128',
          },
          {
            name: 'balance',
            type: 'u64',
          },
          {
            name: 'index',
            type: 'u64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'StakeAction',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Stake',
          },
          {
            name: 'Withdraw',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'MinerCreateEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'quarry',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'miner',
          type: 'publicKey',
          index: !1,
        },
      ],
    },
    {
      name: 'NewRewarderEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: !1,
        },
      ],
    },
    {
      name: 'ClaimEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'stakedToken',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'rewardsToken',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
        {
          name: 'fees',
          type: 'u64',
          index: !1,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: !1,
        },
      ],
    },
    {
      name: 'StakeEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'token',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: !1,
        },
      ],
    },
    {
      name: 'WithdrawEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'token',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: !1,
        },
      ],
    },
    {
      name: 'RewarderAnnualRewardsUpdateEvent',
      fields: [
        {
          name: 'previousRate',
          type: 'u64',
          index: !1,
        },
        {
          name: 'newRate',
          type: 'u64',
          index: !1,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: !1,
        },
      ],
    },
    {
      name: 'QuarryCreateEvent',
      fields: [
        {
          name: 'tokenMint',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: !1,
        },
      ],
    },
    {
      name: 'QuarryRewardsUpdateEvent',
      fields: [
        {
          name: 'tokenMint',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'annualRewardsRate',
          type: 'u64',
          index: !1,
        },
        {
          name: 'rewardsShare',
          type: 'u64',
          index: !1,
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: !1,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6e3,
      name: 'Unauthorized',
      msg: 'You are not authorized to perform this action.',
    },
    {
      code: 6001,
      name: 'InsufficientBalance',
      msg: 'Insufficient staked balance for withdraw request.',
    },
    {
      code: 6002,
      name: 'PendingAuthorityNotSet',
      msg: 'Pending authority not set',
    },
    {
      code: 6003,
      name: 'InvalidRewardsShare',
      msg: 'Invalid quarry rewards share',
    },
    {
      code: 6004,
      name: 'InsufficientAllowance',
      msg: 'Insufficient allowance.',
    },
    {
      code: 6005,
      name: 'NewVaultNotEmpty',
      msg: 'New vault not empty.',
    },
    {
      code: 6006,
      name: 'NotEnoughTokens',
      msg: 'Not enough tokens.',
    },
    {
      code: 6007,
      name: 'InvalidTimestamp',
      msg: 'Invalid timestamp.',
    },
    {
      code: 6008,
      name: 'InvalidMaxClaimFee',
      msg: 'Invalid max claim fee.',
    },
    {
      code: 6009,
      name: 'MaxAnnualRewardsRateExceeded',
      msg: 'Max annual rewards rate exceeded.',
    },
    {
      code: 6010,
      name: 'Paused',
      msg: 'Rewarder is paused.',
    },
    {
      code: 6011,
      name: 'UpperboundExceeded',
      msg: "Rewards earned exceeded quarry's upper bound.",
    },
  ],
};
