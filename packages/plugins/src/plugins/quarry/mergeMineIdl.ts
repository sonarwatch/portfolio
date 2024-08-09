export const mergeMineIdl = {
  version: '5.0.2',
  name: 'quarry_merge_mine',
  instructions: [
    {
      name: 'newPool',
      accounts: [
        {
          name: 'pool',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'MergePool',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'primary_mint',
              },
            ],
          },
        },
        {
          name: 'primaryMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'replicaMint',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'ReplicaMint',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'MergePool',
                path: 'pool',
              },
            ],
          },
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rent',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'bump',
          type: 'u8',
        },
        {
          name: 'mintBump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'newPoolV2',
      accounts: [
        {
          name: 'pool',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'MergePool',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'primary_mint',
              },
            ],
          },
        },
        {
          name: 'primaryMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'replicaMint',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'ReplicaMint',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'MergePool',
                path: 'pool',
              },
            ],
          },
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rent',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'initMergeMiner',
      accounts: [
        {
          name: 'pool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mm',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'MergeMiner',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'MergePool',
                path: 'pool',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'owner',
              },
            ],
          },
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
      args: [
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'initMergeMinerV2',
      accounts: [
        {
          name: 'pool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mm',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'MergeMiner',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'MergePool',
                path: 'pool',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'owner',
              },
            ],
          },
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
      name: 'initMiner',
      accounts: [
        {
          name: 'pool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mm',
          isMut: !1,
          isSigner: !1,
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
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
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
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'mineProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
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
      name: 'initMinerV2',
      accounts: [
        {
          name: 'pool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mm',
          isMut: !1,
          isSigner: !1,
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
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
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
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'mineProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
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
      name: 'stakePrimaryMiner',
      accounts: [
        {
          name: 'mmOwner',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'mmPrimaryTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stake',
          accounts: [
            {
              name: 'pool',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'mm',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'rewarder',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'quarry',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'miner',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'minerVault',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'tokenProgram',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'mineProgram',
              isMut: !1,
              isSigner: !1,
            },
          ],
        },
      ],
      args: [],
    },
    {
      name: 'stakeReplicaMiner',
      accounts: [
        {
          name: 'mmOwner',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'replicaMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'replicaMintTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stake',
          accounts: [
            {
              name: 'pool',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'mm',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'rewarder',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'quarry',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'miner',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'minerVault',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'tokenProgram',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'mineProgram',
              isMut: !1,
              isSigner: !1,
            },
          ],
        },
      ],
      args: [],
    },
    {
      name: 'unstakePrimaryMiner',
      accounts: [
        {
          name: 'mmOwner',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'mmPrimaryTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stake',
          accounts: [
            {
              name: 'pool',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'mm',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'rewarder',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'quarry',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'miner',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'minerVault',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'tokenProgram',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'mineProgram',
              isMut: !1,
              isSigner: !1,
            },
          ],
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
      name: 'unstakeAllReplicaMiner',
      accounts: [
        {
          name: 'mmOwner',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'replicaMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'replicaMintTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stake',
          accounts: [
            {
              name: 'pool',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'mm',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'rewarder',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'quarry',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'miner',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'minerVault',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'tokenProgram',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'mineProgram',
              isMut: !1,
              isSigner: !1,
            },
          ],
        },
      ],
      args: [],
    },
    {
      name: 'withdrawTokens',
      accounts: [
        {
          name: 'owner',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'pool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mm',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'withdrawMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mmTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenDestination',
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
      name: 'rescueTokens',
      accounts: [
        {
          name: 'mmOwner',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'mergePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mm',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !1,
          isSigner: !1,
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
          name: 'quarryMineProgram',
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
          name: 'stakeTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stake',
          accounts: [
            {
              name: 'pool',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'mm',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'rewarder',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'quarry',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'miner',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'minerVault',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'tokenProgram',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'mineProgram',
              isMut: !1,
              isSigner: !1,
            },
          ],
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'MergePool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'primaryMint',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'replicaMint',
            type: 'publicKey',
          },
          {
            name: 'mmCount',
            type: 'u64',
          },
          {
            name: 'totalPrimaryBalance',
            type: 'u64',
          },
          {
            name: 'totalReplicaBalance',
            type: 'u64',
          },
          {
            name: 'reserved',
            type: {
              array: ['u64', 16],
            },
          },
        ],
      },
    },
    {
      name: 'MergeMiner',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pool',
            type: 'publicKey',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'index',
            type: 'u64',
          },
          {
            name: 'primaryBalance',
            type: 'u64',
          },
          {
            name: 'replicaBalance',
            type: 'u64',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'NewMergePoolEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'primaryMint',
          type: 'publicKey',
          index: !1,
        },
      ],
    },
    {
      name: 'InitMergeMinerEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mm',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'primaryMint',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: !1,
        },
      ],
    },
    {
      name: 'InitMinerEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mm',
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
      name: 'StakePrimaryEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mm',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'miner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
      ],
    },
    {
      name: 'StakeReplicaEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mm',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'miner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
      ],
    },
    {
      name: 'UnstakePrimaryEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mm',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'miner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
      ],
    },
    {
      name: 'UnstakeReplicaEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mm',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'miner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
      ],
    },
    {
      name: 'WithdrawTokensEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mm',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mint',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
      ],
    },
    {
      name: 'ClaimEvent',
      fields: [
        {
          name: 'pool',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mm',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'mint',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
        {
          name: 'initialBalance',
          type: 'u64',
          index: !1,
        },
        {
          name: 'endBalance',
          type: 'u64',
          index: !1,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6e3,
      name: 'Unauthorized',
      msg: 'Unauthorized.',
    },
    {
      code: 6001,
      name: 'InsufficientBalance',
      msg: 'Insufficient balance.',
    },
    {
      code: 6002,
      name: 'InvalidMiner',
      msg: 'Invalid miner for the given quarry.',
    },
    {
      code: 6003,
      name: 'CannotWithdrawReplicaMint',
      msg: 'Cannot withdraw a replica mint.',
    },
    {
      code: 6004,
      name: 'OutstandingReplicaTokens',
      msg: 'User must first withdraw from all replica quarries.',
    },
    {
      code: 6005,
      name: 'ReplicaDecimalsMismatch',
      msg: 'The replica mint must have the same number of decimals as the primary mint.',
    },
    {
      code: 6006,
      name: 'ReplicaNonZeroSupply',
      msg: 'The replica mint must have zero supply.',
    },
  ],
};
