export const NxfinanceStakingIdl = {
  version: '0.1.0',
  name: 'nx_stake',
  constants: [
    {
      name: 'ADMIN',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("Ftr58so5RrSnP5TDUuthethQMtyXZBMp2ySZ3RUT6UBG")',
    },
    {
      name: 'DISTRIBUTOR',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("JVPys7nwLWzpnB4ogMpw3KgH3dmGn4Pv6rtUVyKwRY2")',
    },
    {
      name: 'SOL_PK',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("So11111111111111111111111111111111111111112")',
    },
    {
      name: 'SPL_MATH_DECIMAL',
      type: 'u64',
      value: '1000_000_000',
    },
    {
      name: 'STALENESS_THRESHOLD',
      type: 'u64',
      value: '600000000',
    },
    {
      name: 'MINUTE_AS_SECOND',
      type: 'i64',
      value: '60',
    },
    {
      name: 'HOUR_AS_SECOND',
      type: 'i64',
      value: '60 * MINUTE_AS_SECOND',
    },
    {
      name: 'DAY_AS_SECOND',
      type: 'i64',
      value: '24 * HOUR_AS_SECOND',
    },
    {
      name: 'WEEK_AS_SECOND',
      type: 'i64',
      value: '7 * DAY_AS_SECOND',
    },
    {
      name: 'YEAR_AS_SECOND',
      type: 'i64',
      value: '365 * DAY_AS_SECOND',
    },
    {
      name: 'USDC',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") , 6 , pubkey ! ("Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX") , PriceKind :: Pyth ,)',
    },
    {
      name: 'SOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("So11111111111111111111111111111111111111112") , 9 , pubkey ! ("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE") , PriceKind :: Pyth ,)',
    },
    {
      name: 'VSOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7") , 9 , pubkey ! ("Fu9BYC6tWBo1KMKaP3CFoKfRhqv9akmy3DuYwnCyWiyC") , PriceKind :: LiquidateStakeToken ,)',
    },
    {
      name: 'JLP',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4") , 6 , pubkey ! ("2TTGSRSezqFzeLUH8JwRUbtN66XLLaymfYsWRTMjfiMw") , PriceKind :: Pyth ,)',
    },
    {
      name: 'LP_SOLAYER',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("sSo1wxKKr6zW2hqf5hZrp2CawLibcwi1pMBqk5bg2G4") , 9 , pubkey ! ("po1osKDWYF9oiVEGmzKA4eTs8eMveFRMox3bUKazGN2") , PriceKind :: LiquidateStakeToken ,)',
    },
    {
      name: 'SSOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("sSo14endRuUbvQaJS3dq36Q829a3A6BEfoeeRGJywEh") , 9 , pubkey ! ("po1osKDWYF9oiVEGmzKA4eTs8eMveFRMox3bUKazGN2") , PriceKind :: LiquidateStakeToken ,)',
    },
    {
      name: 'ALL_TOKENS',
      type: {
        array: [
          {
            defined: 'TokenInfo',
          },
          6,
        ],
      },
      value: '[USDC , SOL , VSOL , JLP , LP_SOLAYER , SSOL]',
    },
  ],
  instructions: [
    {
      name: 'configNxBase',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nxBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'ConfigNxBaseData',
          },
        },
      ],
    },
    {
      name: 'configStakePool',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'stakePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'ConfigStakePoolData',
          },
        },
      ],
    },
    {
      name: 'configDistributePool',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'distributePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rewardTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'ConfigDistributePoolata',
          },
        },
      ],
    },
    {
      name: 'stakeNote',
      accounts: [
        {
          name: 'staker',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nxBaseAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'distributePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'stakeNx',
      accounts: [
        {
          name: 'staker',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nxBaseAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'distributePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakedVaultAuth',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'stakedVaultTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
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
      name: 'unstakeNxApply',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nxBaseAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'stakePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'distributePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
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
      name: 'unstakeNxExecute',
      accounts: [
        {
          name: 'staker',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nxBaseAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'distributePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakedVaultAuth',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'stakedVaultTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'withdrawTokenAndDistributeSecondly',
      accounts: [
        {
          name: 'distributor',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'distributePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nxBaseAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'distributorDistributeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'distributeVaultAuth',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'distributeVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'distributeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'instructions',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem account'],
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'withdrawTokenAndDistributeFirstly',
      accounts: [
        {
          name: 'distributor',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'distributePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nxBaseAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'withdrawTokenPriceOracle',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'distributeTokenPriceOracle',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'solPriceOracle',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vaultAuth',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'withdrawTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vaultTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'distributorWithdrawTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'distributorDistributeTokenAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'distributeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'instructions',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'withdrawAmt',
          type: 'u64',
        },
      ],
    },
    {
      name: 'stakerClaimDistributionReward',
      accounts: [
        {
          name: 'claimer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'distributePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakePool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nxBaseAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'distributeVaultAuth',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'distributeVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'claimerDistributeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'distributeTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'distributePool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'rewardToken',
            docs: ['Public key of reward token'],
            type: 'publicKey',
          },
          {
            name: 'epochLength',
            docs: [
              'The time interval between each epoch(withdraw token for distribute)',
            ],
            type: 'i64',
          },
          {
            name: 'releaseEpochLength',
            docs: ['The time interval between each epoch(distribute sol)'],
            type: 'i64',
          },
          {
            name: 'adminWithdrawRateEachEpoch',
            docs: ['The rate of each distribute epoch'],
            type: 'u64',
          },
          {
            name: 'adminLastWithdrawedTokens',
            docs: ["Admin's last token extraction record"],
            type: {
              vec: {
                defined: 'AdminWithdrawDetail',
              },
            },
          },
          {
            name: 'distributeTotal',
            docs: ['Total number of tokens that can be released'],
            type: 'u64',
          },
          {
            name: 'releasedTotal',
            docs: ['Total number of tokens that have been released'],
            type: 'u64',
          },
          {
            name: 'startTime',
            docs: ['Start time of this distribution'],
            type: 'i64',
          },
          {
            name: 'finishTime',
            docs: ['Finish time of this distribution'],
            type: 'i64',
          },
          {
            name: 'rewardPerNotes',
            docs: [
              'How much REWARD can be awarded per unit of NOTE, It increases each time a reward is distributed, but never decreases.',
            ],
            type: 'u64',
          },
          {
            name: 'swapTemp',
            type: {
              defined: 'SwapTemp',
            },
          },
        ],
      },
    },
    {
      name: 'nxBase',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'paused',
            docs: ['Disable all protocol operations'],
            type: 'bool',
          },
          {
            name: 'withdrawLockUpPeriod',
            docs: ['Lock-up period for withdrawals(second)'],
            type: 'u64',
          },
          {
            name: 'swapSlippageRate',
            docs: [
              'Maximum slippage supported for all swap transactions。 The denominator is a constant: SPL_MATH_DECIMAL',
            ],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'stakeAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'notes',
            docs: ['Stake NX can get the note'],
            type: 'u64',
          },
          {
            name: 'stakedTokens',
            docs: ['Staking nx can get notes and rewards'],
            type: 'u64',
          },
          {
            name: 'stakedNotes',
            docs: [
              'Staking nx can get notes and rewards, and these notes can be re-staking to get rewards',
            ],
            type: 'u64',
          },
          {
            name: 'withdrawingTokens',
            docs: ['Total amount of tokens withdrawing,'],
            type: 'u64',
          },
          {
            name: 'timeOfWithdrawApply',
            docs: ['Time to apply for withdrawal'],
            type: 'i64',
          },
          {
            name: 'claimableReward',
            type: 'u64',
          },
          {
            name: 'lastUpdateNoteTime',
            type: 'i64',
          },
          {
            name: 'lastDistributedAndNoteRate',
            docs: [
              'The ratio of the distributed to note in the last time update',
            ],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'stakePool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'stakeTokenMint',
            docs: ['Public key of tokens supporting staking'],
            type: 'publicKey',
          },
          {
            name: 'stakedTokens',
            docs: ['Total amount of tokens staked'],
            type: 'u64',
          },
          {
            name: 'stakedNotes',
            docs: [
              'Staking nx can get notes and rewards, and these notes can be re-staking to get rewards',
            ],
            type: 'u64',
          },
          {
            name: 'withdrawingTokens',
            docs: ['Total amount of tokens withdrawing,'],
            type: 'u64',
          },
          {
            name: 'increaseNoteRatePerSecond',
            docs: ['The ratio of notes to tokens added per second'],
            type: 'u64',
          },
          {
            name: 'maxMultipleOfNote',
            docs: ['The maximum note can be nx times'],
            type: 'u64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'ConfigDistributePoolata',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'adminWithdrawRateEachEpoch',
            type: 'u64',
          },
          {
            name: 'epochLength',
            type: 'i64',
          },
          {
            name: 'releaseEpochLength',
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'ConfigNxBaseData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'paused',
            type: 'bool',
          },
          {
            name: 'withdrawLockUpPeriod',
            docs: ['Lock-up period for withdrawals(second)'],
            type: 'u64',
          },
          {
            name: 'swapSlippageRate',
            docs: [
              'Maximum slippage supported for all swap transactions。 The denominator is a constant: SPL_MATH_DECIMAL',
            ],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'ConfigStakePoolData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'increaseNoteRatePerSecond',
            type: 'u64',
          },
          {
            name: 'maxMultipleOfNote',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'ConfigStakePoolata',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'increaseNoteRatePerSecond',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'Amount',
      docs: ['Represent an amount of some value (like tokens, or notes)'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'kind',
            type: {
              defined: 'AmountKind',
            },
          },
          {
            name: 'value',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'AdminWithdrawDetail',
      docs: ['collateral detailed state'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenMint',
            docs: ['Public key of distribut token'],
            type: 'publicKey',
          },
          {
            name: 'lastTime',
            docs: ['The last time a reward was issued using this coin'],
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'SwapTemp',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'beforeAmount',
            type: 'u64',
          },
          {
            name: 'expected',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'TokenInfo',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'mintPk',
            type: 'publicKey',
          },
          {
            name: 'decimals',
            type: 'i32',
          },
          {
            name: 'priceOracle',
            type: 'publicKey',
          },
          {
            name: 'oracleKind',
            type: {
              defined: 'PriceKind',
            },
          },
        ],
      },
    },
    {
      name: 'AmountKind',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Tokens',
          },
          {
            name: 'Notes',
          },
        ],
      },
    },
    {
      name: 'PoolAction',
      docs: [
        'Represents the primary pool actions, used in determining the',
        'rounding direction between tokens and notes.',
      ],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Deposit',
          },
          {
            name: 'Withdraw',
          },
        ],
      },
    },
    {
      name: 'RoundingDirection',
      docs: [
        'Represents the direction in which we should round when converting',
        'between tokens and notes.',
      ],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Down',
          },
          {
            name: 'Up',
          },
        ],
      },
    },
    {
      name: 'PriceKind',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Pyth',
          },
          {
            name: 'Switchboard',
          },
          {
            name: 'LiquidateStakeToken',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'Paused',
      msg: 'Protocol paused',
    },
    {
      code: 6001,
      name: 'NotSupportToken',
      msg: 'Not support token',
    },
    {
      code: 6002,
      name: 'InvalidAmount',
      msg: 'Invalid operation amount',
    },
    {
      code: 6003,
      name: 'DuplicateApplication',
      msg: 'Duplicate application',
    },
    {
      code: 6004,
      name: 'NoApplicationFound',
      msg: 'No application found',
    },
    {
      code: 6005,
      name: 'TimeIsNotYet',
      msg: 'Time is not yet',
    },
    {
      code: 6006,
      name: 'VaultEmpty',
      msg: 'Vault empty',
    },
    {
      code: 6007,
      name: 'NotStakePool',
      msg: 'Failed to deserialize stake pool account',
    },
    {
      code: 6008,
      name: 'StalePrice',
      msg: 'Stale price',
    },
    {
      code: 6009,
      name: 'NoClaimable',
      msg: 'Does not have claimable amount',
    },
    {
      code: 6010,
      name: 'NotStakingToken',
      msg: 'No staking token',
    },
    {
      code: 6011,
      name: 'PythError',
      msg: 'Could not load price account',
    },
    {
      code: 6012,
      name: 'SwitchboardError',
      msg: 'Invalid aggregator round',
    },
    {
      code: 6013,
      name: 'InvalidOracle',
      msg: 'Invalid pool oracle',
    },
    {
      code: 6014,
      name: 'AddressMismatch',
      msg: 'Address Mismatch',
    },
    {
      code: 6015,
      name: 'AddressNotWhiteListed',
      msg: 'Address not in white list',
    },
    {
      code: 6016,
      name: 'ProgramMismatch',
      msg: 'Program Mismatch',
    },
    {
      code: 6017,
      name: 'DiscriminatorMismatch',
      msg: 'Discriminator mismatch',
    },
    {
      code: 6018,
      name: 'UnknownInstruction',
      msg: 'Unknown Instruction',
    },
    {
      code: 6019,
      name: 'MissingSwapInstruction',
      msg: 'Missing swap ix',
    },
    {
      code: 6020,
      name: 'MissingBeforeInstruction',
      msg: 'Missing pre-swap ix',
    },
    {
      code: 6021,
      name: 'MissingAfterInstruction',
      msg: 'Missing post-swap ix',
    },
    {
      code: 6022,
      name: 'IncorrectAccount',
      msg: 'Incorrect account',
    },
    {
      code: 6023,
      name: 'InvalidAfterAmount',
      msg: 'Invalid post amount to after ix',
    },
    {
      code: 6024,
      name: 'InvalidAccountDiscriminator',
      msg: 'Invalid account discriminator',
    },
    {
      code: 6025,
      name: 'UnableToDeserializeAccount',
      msg: 'Unable to deserialize account',
    },
  ],
};
