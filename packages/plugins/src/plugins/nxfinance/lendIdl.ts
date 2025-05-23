export const NxfinanceLendIdl = {
  version: '0.1.0',
  name: 'nx_lend',
  constants: [
    {
      name: 'ADMIN',
      type: 'publicKey',
      value: 'pubkey ! ("9zqhJSecBS2ya3BW5wBQk3T56CZcDZaeh5Ks1QEqafei")',
    },
    {
      name: 'FEE_RECEIVER',
      type: 'publicKey',
      value: 'pubkey ! ("EBX8D2YkyqU2xZYj2x9HqYify5ZXX4t7qgzkxfDe3puw")',
    },
    {
      name: 'PROFIT_SHARE',
      type: 'publicKey',
      value: 'pubkey ! ("DVEk388n1yt4msZzZM1HGf4YfoAzRT3RYws8CnyV9t3F")',
    },
    {
      name: 'LIQUIDATE_THRESHOLD',
      type: 'u64',
      value: '95',
    },
    {
      name: 'STALENESS_THRESHOLD',
      type: 'u64',
      value: '180',
    },
    {
      name: 'MAX_LEVERAGE',
      type: 'u64',
      value: '10000000',
    },
    {
      name: 'A_MINUTES_SECONDS',
      type: 'i64',
      value: '60',
    },
    {
      name: 'A_HOUR_SECONDS',
      type: 'i64',
      value: '60 * A_MINUTES_SECONDS',
    },
    {
      name: 'A_DAY_SECONDS',
      type: 'i64',
      value: '24 * A_HOUR_SECONDS',
    },
    {
      name: 'A_WEEK_SECONDS',
      type: 'i64',
      value: '7 * A_DAY_SECONDS',
    },
    {
      name: 'NX_SOLAYER_POINT_PER_SEC',
      type: 'u64',
      value: '1000',
    },
    {
      name: 'JUPITER_SWAP',
      type: 'publicKey',
      value: 'pubkey ! ("JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4")',
    },
    {
      name: 'FRAGMETRIC_PROGRAM',
      type: 'publicKey',
      value: 'pubkey ! ("fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3")',
    },
    {
      name: 'SANCTUM_STAKE_POOL',
      type: 'publicKey',
      value: 'pubkey ! ("SP12tWFxD9oJsVWNavTTBZvMbA6gkAmxtVgxdqvyvhY")',
    },
    {
      name: 'USDC',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") , 6 , pubkey ! ("Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX") , PriceKind :: Pyth , None)',
    },
    {
      name: 'SOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("So11111111111111111111111111111111111111112") , 9 , pubkey ! ("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE") , PriceKind :: Pyth , None)',
    },
    {
      name: 'VSOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7") , 9 , pubkey ! ("Fu9BYC6tWBo1KMKaP3CFoKfRhqv9akmy3DuYwnCyWiyC") , PriceKind :: LiquidateStakeToken , None)',
    },
    {
      name: 'JLP',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4") , 6 , pubkey ! ("2TTGSRSezqFzeLUH8JwRUbtN66XLLaymfYsWRTMjfiMw") , PriceKind :: Pyth , None)',
    },
    {
      name: 'SSOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("sSo14endRuUbvQaJS3dq36Q829a3A6BEfoeeRGJywEh") , 9 , pubkey ! ("po1osKDWYF9oiVEGmzKA4eTs8eMveFRMox3bUKazGN2") , PriceKind :: LiquidateStakeToken , Some (pubkey ! ("sSo1wxKKr6zW2hqf5hZrp2CawLibcwi1pMBqk5bg2G4")))',
    },
    {
      name: 'SBBSOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("bybitpqC3RRzTmf3PNYd76c9CiUz1DXtsjvuhLKjsbA") , 9 , pubkey ! ("2aMLkB5p5gVvCwKkdSo5eZAL1WwhZbxezQr1wxiynRhq") , PriceKind :: LiquidateStakeToken , Some (pubkey ! ("Bybit2vBJGhPF52GBdNaQfUJ6ZpThSgHBobjWZpLPb4B")))',
    },
    {
      name: 'SHUBSOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("sHUBzCzkGZqpKmSLVLtTk2ViHwZ6wCS9FRvuq3g2uSx") , 9 , pubkey ! ("ECRqn7gaNASuvTyC5xfCUjehWZCSowMXstZiM5DNweyB") , PriceKind :: LiquidateStakeToken , Some (pubkey ! ("HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX")))',
    },
    {
      name: 'WFRAGSOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("WFRGSWjaz8tbAxsJitmbfRuFV2mSNwy7BMWcCwaA28U") , 9 , pubkey ! ("3TK9fNePM4qdKC4dwvDe8Bamv14prDqdVfuANxPeiryb") , PriceKind :: LiquidateStakeToken , None)',
    },
    {
      name: 'FRAGSOL',
      type: {
        defined: 'TokenInfo',
      },
      value:
        'TokenInfo :: new (pubkey ! ("FRAGSEthVFL7fdqM8hxfxkfCZzUvmg21cqPJVvC1qdbo") , 9 , pubkey ! ("3TK9fNePM4qdKC4dwvDe8Bamv14prDqdVfuANxPeiryb") , PriceKind :: LiquidateStakeToken , None)',
    },
    {
      name: 'LENDING_POOL_TOKENS',
      type: {
        array: [
          {
            defined: 'TokenInfo',
          },
          1,
        ],
      },
      value: '[SOL]',
    },
    {
      name: 'V_SOL_COLLATERAL_TOKENS',
      type: {
        array: [
          {
            defined: 'TokenInfo',
          },
          1,
        ],
      },
      value: '[VSOL]',
    },
    {
      name: 'V_SOL_BORROW_TOKENS',
      type: {
        array: [
          {
            defined: 'TokenInfo',
          },
          1,
        ],
      },
      value: '[SOL]',
    },
    {
      name: 'V_SOL_LEVERAGE_TOKENS',
      type: {
        array: [
          {
            defined: 'TokenInfo',
          },
          1,
        ],
      },
      value: '[VSOL]',
    },
    {
      name: 'TOKENS',
      type: {
        array: [
          {
            defined: 'TokenInfo',
          },
          4,
        ],
      },
      value: '[SOL , JLP , USDC , SSOL]',
    },
    {
      name: 'SOLAYER_TOKENS',
      type: {
        array: [
          {
            defined: 'TokenInfo',
          },
          3,
        ],
      },
      value: '[SSOL , SBBSOL , SHUBSOL]',
    },
  ],
  instructions: [
    {
      name: 'initMarket',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'feeTo',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'nxMarketAdmin',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'nxMarket',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
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
          name: 'args',
          type: {
            defined: 'InitMarketParams',
          },
        },
      ],
    },
    {
      name: 'configNxMarket',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !0,
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
      args: [
        {
          name: 'args',
          type: {
            defined: 'MarketUpdateData',
          },
        },
      ],
    },
    {
      name: 'updateMarketAdmin',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !0,
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
      args: [
        {
          name: 'newAdmin',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'createLendingPool',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for the token being custodied by the pool'],
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
          name: 'associatedTokenProgram',
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
          name: 'rates',
          type: {
            vec: {
              defined: 'InterestRateConfig',
            },
          },
        },
      ],
    },
    {
      name: 'configInterestRate',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for the token being custodied by the pool'],
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
          name: 'associatedTokenProgram',
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
          name: 'rates',
          type: {
            vec: {
              defined: 'InterestRateConfig',
            },
          },
        },
      ],
    },
    {
      name: 'createCollateralPool',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for the token being custodied by the pool'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
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
      name: 'lendingDeposit',
      accounts: [
        {
          name: 'depositor',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for the token being custodied by the pool'],
        },
        {
          name: 'depositorTokenMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The source of the tokens to be deposited'],
        },
        {
          name: 'lendingAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'lendingWithdraw',
      accounts: [
        {
          name: 'depositor',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for the token being custodied by the pool'],
        },
        {
          name: 'depositorTokenMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The source of the tokens to be deposited'],
        },
        {
          name: 'lendingAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'feeDestination',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'feeTo',
          isMut: !1,
          isSigner: !1,
          docs: ['The wallet address of the fee receiver'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'notes',
          type: 'u64',
        },
      ],
    },
    {
      name: 'claimProtocolFee',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'vault',
          isMut: !0,
          isSigner: !1,
          docs: [
            "Read-only, the token account holding the pool's deposited funds",
          ],
        },
        {
          name: 'adminTokenMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'initFragmetricPool',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'fragmetricPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
      ],
      args: [
        {
          name: 'receiptToken',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'fragmetricLeverage',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'fragsolFundAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowerWfragsolAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unwrapper',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unwrapperMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'feeReceiver',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'collateralAmount',
          type: 'u64',
        },
        {
          name: 'borrowAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'fragmetricAfterBorrow',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragsolFundAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragmetricPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragmetricUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'wfragsolVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowerWfragsolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowerFragsolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'fragmetricProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'collateralAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'fragmetricReducePositionFragsol',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragsolFundAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragmetricPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragmetricUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'wfragsolVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'userWfragsolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'userSolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'wfragsolAmount',
          type: 'u64',
        },
        {
          name: 'withdrawAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'fragmetricAfterReducePositionFragsol',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragsolFundAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'userSolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
      ],
    },
    {
      name: 'fragmetricReducePositionSol',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragsolFundAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'fragmetricPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragmetricUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'wfragsolVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'userWfragsolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'userSolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'wfragsolAmount',
          type: 'u64',
        },
        {
          name: 'repayAmount',
          type: 'u64',
        },
        {
          name: 'withdrawAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'fragmetricAfterReducePositionSol',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragsolFundAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'userSolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'repayAmount',
          type: 'u64',
        },
        {
          name: 'withdrawAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'fragmetricLiquidate',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragsolFundAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragmetricPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'fragmetricUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'wfragsolVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidatorWfragsolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidatorSolAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'liquidatee',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'fragmetricAfterLiquidate',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidatorSolAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidatee',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'unwrapper',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unwrapperMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'liquidatee',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'initSolayerPool',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'solayerPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
      ],
      args: [
        {
          name: 'lrtMint',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'solayerDepositSol',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowerTokenAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
        {
          name: 'collateralAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'solayerDepositLrt',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lstVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lrtVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowerTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiLstMint',
          isMut: !0,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'cpiRstMint',
          isMut: !0,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'cpiSolayerVault',
          isMut: !0,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'cpiSolayerPool',
          isMut: !1,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'solayerProgram',
          isMut: !1,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
        {
          name: 'collateralAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'solayerLeverage',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowerTokenAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unwrapper',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unwrapperMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'feeReceiver',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
        {
          name: 'collateralAmount',
          type: 'u64',
        },
        {
          name: 'borrowAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'solayerBorrow',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowerTokenAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unwrapper',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unwrapperMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
        {
          name: 'borrowAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'solayerAfterBorrow',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lstVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lrtVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowerTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiLstMint',
          isMut: !0,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'cpiRstMint',
          isMut: !0,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'cpiSolayerVault',
          isMut: !0,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'cpiSolayerPool',
          isMut: !1,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'solayerProgram',
          isMut: !1,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'registerWithdraw',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'cpiLstMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiLstAta',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiRstAta',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiRstMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiSolayerVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiSolayerPool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'cpiValidatorList',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiWithdrawAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'cpiValidatorAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiStakeAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiManagerFeeAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePoolProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakeProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'clockProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'withdrawFrom',
          type: 'publicKey',
        },
        {
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
        {
          name: 'lrtAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'solayerRepay',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiStakeAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakeHistory',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakeProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'clockProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'withdrawalIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
        {
          name: 'repayAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'solayerReducePosition',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lstVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lrtVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'userTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiStakeAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiLstMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiRstMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiSolayerVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiSolayerPool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'solayerProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakeHistory',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakeProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'clockProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'withdrawalIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
        {
          name: 'repayAmount',
          type: 'u64',
        },
        {
          name: 'withdrawAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'solayerLiquidate',
      accounts: [
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakePool',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solLendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solayerUser',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'cpiStakeAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidatee',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakeHistory',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'stakeProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'clockProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'withdrawalIdx',
          type: 'u8',
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
        },
        {
          name: 'leverageMint',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'vSolCreateMiner',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'quarryProgram',
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
          docs: ['[Quarry] to create a [Miner] for.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['[Rewarder].'],
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['System program.'],
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
          docs: ['[Mint] of the token to create a [Quarry] for.'],
        },
        {
          name: 'minerVault',
          isMut: !1,
          isSigner: !1,
          docs: ['[TokenAccount] holding the token [Mint].'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['SPL Token program.'],
        },
      ],
      args: [],
    },
    {
      name: 'vSolInitPool',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
      ],
      args: [],
    },
    {
      name: 'vSolDepositCollateral',
      accounts: [
        {
          name: 'depositor',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'depositorCollateralMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The source of the tokens to be deposited'],
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Vault of the miner.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['Rewarder'],
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'vSolWithdrawCollateral',
      accounts: [
        {
          name: 'borrower',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to withdraw the tokens'],
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'leveragePriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's withdrawed funds"],
        },
        {
          name: 'borrowerCollateralMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The source of the tokens to be withdrawed'],
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Vault of the miner.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['Rewarder'],
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'noteAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'vSolWithdrawLeverage',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'withdrawer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to position'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolLeverageVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'feeDestination',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'feeTo',
          isMut: !1,
          isSigner: !1,
          docs: ['The wallet address of the fee receiver'],
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !1,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'leveragePriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'withdrawerLeverageMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Vault of the miner.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['Rewarder'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: [
            '***************** Solana ecosystem accounts *****************/',
          ],
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'noteAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'vSolBorrow',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'borrower',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to position'],
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'collateralPool',
          isMut: !1,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'leveragePriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'borrowerBorrowMintAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'borrowerLeverageMintAccount',
          isMut: !1,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'poolVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'unwrapper',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'unwrapperMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'feeReceiver',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'borrowTokens',
          type: 'u64',
        },
      ],
    },
    {
      name: 'vSolAfterBorrow',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'borrower',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to position'],
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !1,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'leveragePriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'borrowerLeverageMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'poolVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Vault of the miner.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ["User's staked token account", 'Rewarder'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: [
            '***************** Solana ecosystem accounts *****************/',
          ],
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'positionIdx',
          type: 'u8',
        },
      ],
    },
    {
      name: 'vSolRepayWithCollateral',
      docs: ['* amount: collateral amount'],
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'repayer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to position'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolCollateralVault',
          isMut: !0,
          isSigner: !1,
          docs: [
            "The token account holding the pool's deposited funds",
            "The token account holding the pool's deposited funds",
          ],
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'repayerCollateralMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'repayerBorrowMintAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Vault of the miner.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['Rewarder'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: [
            '***************** Solana ecosystem accounts *****************/',
          ],
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'vSolRepayWithLeverage',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'repayer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to position'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolLeverageVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'leveragePriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'repayerLeverageMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'repayerBorrowMintAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Vault of the miner.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['Rewarder'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: [
            '***************** Solana ecosystem accounts *****************/',
          ],
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'positionIdx',
          type: 'u8',
        },
        {
          name: 'borrowTokens',
          type: 'u64',
        },
      ],
    },
    {
      name: 'vSolAfterRepay',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
        },
        {
          name: 'repayer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to position'],
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'collateralPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'poolBorrowVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'repayerBorrowMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'loanOwner',
          type: 'publicKey',
        },
        {
          name: 'positionIdx',
          type: 'u8',
        },
      ],
    },
    {
      name: 'vSolRefreshPoints',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintWrapper',
          isMut: !0,
          isSigner: !1,
          docs: ['Mint wrapper.'],
        },
        {
          name: 'mintWrapperProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Mint wrapper program.'],
        },
        {
          name: 'minter',
          isMut: !0,
          isSigner: !1,
          docs: ['[quarry_mint_wrapper::Minter] information.'],
        },
        {
          name: 'rewardsTokenMint',
          isMut: !0,
          isSigner: !1,
          docs: ['Mint of the rewards token.'],
        },
        {
          name: 'poolRewardVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'claimFeeTokenAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['Account to send claim fees to.'],
        },
        {
          name: 'claimMiner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'claimQuarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'claimRewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['Rewarder'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Token program'],
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
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
      name: 'vSolLiquidateWithCollateral',
      accounts: [
        {
          name: 'liquidator',
          isMut: !0,
          isSigner: !0,
          docs: ['The address with authority to the liquidator rewards'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'collateralPool',
          isMut: !1,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'leveragePriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'liquidatorCollateralMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidatorBorrowMintAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolCollateralVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Vault of the miner.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['Rewarder'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: [
            '***************** Solana ecosystem accounts *****************/',
          ],
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'liquidatee',
          type: 'publicKey',
        },
        {
          name: 'positionIdx',
          type: 'u8',
        },
      ],
    },
    {
      name: 'vSolLiquidateWithLeverage',
      accounts: [
        {
          name: 'liquidator',
          isMut: !0,
          isSigner: !0,
          docs: ['The address with authority to the liquidator rewards'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'collateralPool',
          isMut: !1,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'leveragePriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'liquidatorLeverageMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidatorBorrowMintAccount',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'poolLeverageVault',
          isMut: !0,
          isSigner: !1,
          docs: ["The token account holding the pool's deposited funds"],
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'miner',
          isMut: !0,
          isSigner: !1,
          docs: ['Miner.'],
        },
        {
          name: 'quarry',
          isMut: !0,
          isSigner: !1,
          docs: ['Quarry to claim from.'],
        },
        {
          name: 'minerVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Vault of the miner.'],
        },
        {
          name: 'rewarder',
          isMut: !1,
          isSigner: !1,
          docs: ['Rewarder'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: [
            '***************** Solana ecosystem accounts *****************/',
          ],
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'systemProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'quarryProgram',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'liquidatee',
          type: 'publicKey',
        },
        {
          name: 'positionIdx',
          type: 'u8',
        },
      ],
    },
    {
      name: 'vSolAfterLiquidate',
      accounts: [
        {
          name: 'liquidator',
          isMut: !0,
          isSigner: !0,
          docs: ['The address with authority to the liquidator rewards'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'lendingPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'collateralPool',
          isMut: !1,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'collateralPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'borrowPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'leveragePriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'solPriceOracle',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'liquidatorCollateralMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidatorBorrowMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'liquidateeBorrowMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'poolBorrowVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'instructions',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: ['Solana ecosystem accounts'],
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'liquidatee',
          type: 'publicKey',
        },
        {
          name: 'positionIdx',
          type: 'u8',
        },
      ],
    },
    {
      name: 'vSolWithdrawPoint',
      accounts: [
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'withdrawer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to position'],
        },
        {
          name: 'nxMarket',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'marketAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'vPointMint',
          isMut: !0,
          isSigner: !1,
          docs: ['Mint of the rewards token.'],
        },
        {
          name: 'poolPointVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'withdrawerPointAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'positionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'vSolPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'collateralMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The collateral token'],
        },
        {
          name: 'borrowMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The borrrow token'],
        },
        {
          name: 'leverageMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The leverage token'],
        },
        {
          name: 'tokenProgram',
          isMut: !1,
          isSigner: !1,
          docs: [
            '***************** Solana ecosystem accounts *****************/',
          ],
        },
        {
          name: 'associatedTokenProgram',
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
          name: 'positionIdx',
          type: 'u8',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'collateralPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'marketAuthority',
            docs: ['The pool authority to act'],
            type: 'publicKey',
          },
          {
            name: 'tokenMint',
            docs: ['The token the pool allows lending and borrowing on'],
            type: 'publicKey',
          },
          {
            name: 'depositTokens',
            docs: ["The total amount of tokens available in the pool's vault"],
            type: 'u64',
          },
          {
            name: 'depositNotes',
            docs: ['The total amount of notes issued to depositors of tokens.'],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'fragmetricPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'receiptToken',
            docs: ['Mint address of wfragSOL'],
            type: 'publicKey',
          },
          {
            name: 'amount',
            docs: ['Amount of wfragSOL currently held by NX'],
            type: 'u64',
          },
          {
            name: 'totalNxFragmetricPoints',
            docs: ["Total NX fragmetric points 'created'"],
            type: 'u64',
          },
          {
            name: 'lastUpdateTime',
            docs: ['Last timestamp points is updated'],
            type: 'i64',
          },
          {
            name: 'padding',
            type: {
              array: ['u64', 10],
            },
          },
        ],
      },
    },
    {
      name: 'fragmetricPosition',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'owner',
            docs: ['Data owner'],
            type: 'publicKey',
          },
          {
            name: 'positions',
            docs: ["Record the user's position information list"],
            type: {
              vec: {
                defined: 'PositionDetail',
              },
            },
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
      name: 'fragmetricUser',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'receiptToken',
            docs: ['Mint address of wfragSOL'],
            type: 'publicKey',
          },
          {
            name: 'amount',
            docs: [
              'Amount of wfragSOL user has/contributed, can be sum of multiple positions',
            ],
            type: 'u64',
          },
          {
            name: 'nxFragmetricPoints',
            docs: ['Amount of NX Solayer points owned'],
            type: 'u64',
          },
          {
            name: 'lastUpdateTime',
            docs: ['Last timestamp points is updated'],
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'lendingAccount',
      docs: ['User margin state, with collateral & loan details'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'owner',
            docs: ['Owner authority which can borrow liquidity'],
            type: 'publicKey',
          },
          {
            name: 'depositNotes',
            type: 'u64',
          },
          {
            name: 'depositTokens',
            type: 'u64',
          },
          {
            name: 'lastNoteRate',
            type: 'u64',
          },
          {
            name: 'totalReward',
            docs: ['The total amount of notes issued to depositors of tokens.'],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'lendingPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'tokenMint',
            docs: [
              'The pool authority to act',
              'The token the pool allows lending and borrowing on',
            ],
            type: 'publicKey',
          },
          {
            name: 'borrowTokens',
            docs: [
              'The total amount of tokens borrowed, that need to be repaid to',
              'the pool.',
            ],
            type: 'u64',
          },
          {
            name: 'borrowNotes',
            docs: ['The total amount of notes issued to borrowers of tokens'],
            type: 'u64',
          },
          {
            name: 'depositTokens',
            docs: ["The total amount of tokens available in the pool's vault"],
            type: 'u64',
          },
          {
            name: 'depositNotes',
            docs: ['The total amount of notes issued to depositors of tokens.'],
            type: 'u64',
          },
          {
            name: 'depositInterest',
            type: 'u64',
          },
          {
            name: 'borrowInterest',
            docs: [
              'Amount of unrepaid interest by borrowers, for loan note exchange rate calculation',
            ],
            type: 'u64',
          },
          {
            name: 'protocolFee',
            docs: ['10% of interest goes to the protocol,'],
            type: 'u64',
          },
          {
            name: 'accruedUntil',
            docs: ['The time the interest was last accrued up to'],
            type: 'i64',
          },
          {
            name: 'utilizationFlag',
            docs: ['If the utilization rate is flagged as full'],
            type: 'u16',
          },
          {
            name: 'interestRateConfigs',
            type: {
              vec: {
                defined: 'InterestRateData',
              },
            },
          },
        ],
      },
    },
    {
      name: 'leveragePool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'marketAuthority',
            docs: ['The pool authority to act'],
            type: 'publicKey',
          },
          {
            name: 'tokenMint',
            docs: ['The token the pool allows lending and borrowing on'],
            type: 'publicKey',
          },
          {
            name: 'depositTokens',
            docs: ["The total amount of tokens available in the pool's vault"],
            type: 'u64',
          },
          {
            name: 'depositNotes',
            docs: ['The total amount of notes issued to depositors of tokens.'],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'nxMarket',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admin',
            docs: ['Account that has admin authority over the nxLend'],
            type: 'publicKey',
          },
          {
            name: 'feeTo',
            docs: ['Developer fee receiving address'],
            type: 'publicKey',
          },
          {
            name: 'paused',
            docs: ['Disable all protocol operations'],
            type: 'bool',
          },
          {
            name: 'bumpSeed',
            type: 'u8',
          },
          {
            name: 'withdrawFeeRate',
            docs: [
              'jlp withdraw fee rate for taking profit。 The denominator is a constant: DENOMINATOR',
            ],
            type: 'u16',
          },
          {
            name: 'protocolFeeRate',
            docs: [
              'interest fee rate。 The denominator is a constant: DENOMINATOR',
            ],
            type: 'u16',
          },
          {
            name: 'swapSlippageRate',
            docs: [
              'Maximum slippage supported for all swap transactions。 The denominator is a constant: DENOMINATOR',
            ],
            type: 'u16',
          },
          {
            name: 'liquidationRewardRate',
            type: 'u16',
          },
          {
            name: 'penaltyInterestRate',
            docs: [
              'Penalty interest point。 The denominator is a constant: DENOMINATOR',
            ],
            type: 'u16',
          },
          {
            name: 'vsolPointFeeRate',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'position',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'owner',
            docs: ['Data owner'],
            type: 'publicKey',
          },
          {
            name: 'positions',
            docs: ["Record the user's position information list"],
            type: {
              vec: {
                defined: 'PositionDetail',
              },
            },
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
      name: 'solayerPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'lrtMint',
            docs: ['Mint address of LRT'],
            type: 'publicKey',
          },
          {
            name: 'amount',
            docs: ['Amount of LRT currently held by NX'],
            type: 'u64',
          },
          {
            name: 'totalNxSolayerPoints',
            docs: ["Total NX Solayer points 'created'"],
            type: 'u64',
          },
          {
            name: 'lastUpdateTime',
            docs: ['Last timestamp points is updated'],
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'solayerUser',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'lrtMint',
            docs: ['Mint address of LRT'],
            type: 'publicKey',
          },
          {
            name: 'amount',
            docs: [
              'Amount of LRT user has/contributed, can be sum of multiple positions',
            ],
            type: 'u64',
          },
          {
            name: 'nxSolayerPoints',
            docs: ['Amount of NX Solayer points owned'],
            type: 'u64',
          },
          {
            name: 'lastUpdateTime',
            docs: ['Last timestamp points is updated'],
            type: 'i64',
          },
          {
            name: 'withdrawals',
            type: {
              vec: {
                vec: {
                  defined: 'StakePoolWithdrawal',
                },
              },
            },
          },
        ],
      },
    },
    {
      name: 'vSolPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'vsolLeverageTokens',
            docs: ['The number of VSOls pledged by leverage'],
            type: 'u64',
          },
          {
            name: 'vsolLeverageNotes',
            type: 'u64',
          },
          {
            name: 'vsolPoints',
            docs: [
              'Every time the pool collects points, it will be added to this value',
            ],
            type: 'u64',
          },
          {
            name: 'lastVsolPointPerLeverageNote',
            docs: [
              'rate = (vsol_points_new - vsol_points_old)/vsol_leverage_notes',
            ],
            type: 'u64',
          },
          {
            name: 'vsolPointsFeeClaimable',
            type: 'u64',
          },
          {
            name: 'lastVsolPointUpdateTime',
            docs: ['The time when the point was last updated'],
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'vSolPosition',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nxMarket',
            docs: ["Market's pubkey"],
            type: 'publicKey',
          },
          {
            name: 'owner',
            docs: ['Data owner'],
            type: 'publicKey',
          },
          {
            name: 'positions',
            docs: ["Record the user's position information list"],
            type: {
              vec: {
                defined: 'VSolPositionDetail',
              },
            },
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
  ],
  types: [
    {
      name: 'MarketUpdateData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admin',
            docs: ['Account that has admin authority over the nxLend'],
            type: 'publicKey',
          },
          {
            name: 'feeTo',
            docs: ['Developer fee receiving address'],
            type: 'publicKey',
          },
          {
            name: 'paused',
            docs: ['Disable all protocol operations'],
            type: 'bool',
          },
          {
            name: 'bumpSeed',
            type: 'u8',
          },
          {
            name: 'withdrawFeeRate',
            docs: [
              'jlp withdraw fee rate for taking profit。 The denominator is a constant: DENOMINATOR',
            ],
            type: 'u16',
          },
          {
            name: 'protocolFeeRate',
            docs: [
              'interest fee rate。 The denominator is a constant: DENOMINATOR',
            ],
            type: 'u16',
          },
          {
            name: 'swapSlippageRate',
            docs: [
              'Maximum slippage supported for all swap transactions。 The denominator is a constant: DENOMINATOR',
            ],
            type: 'u16',
          },
          {
            name: 'liquidationRewardRate',
            type: 'u16',
          },
          {
            name: 'penaltyInterestRate',
            docs: [
              'Penalty interest point。 The denominator is a constant: DENOMINATOR',
            ],
            type: 'u16',
          },
          {
            name: 'vsolPointFeeRate',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'InterestRateConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'utilizationRate',
            type: 'i32',
          },
          {
            name: 'kValue',
            type: 'i32',
          },
          {
            name: 'bValue',
            type: 'i32',
          },
        ],
      },
    },
    {
      name: 'InitMarketParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'swapSlippageRate',
            type: 'u16',
          },
          {
            name: 'penaltyInterestRate',
            type: 'u16',
          },
          {
            name: 'liquidationRewardRate',
            type: 'u16',
          },
          {
            name: 'withdrawFeeRate',
            type: 'u16',
          },
          {
            name: 'protocolFeeRate',
            type: 'u16',
          },
          {
            name: 'vsolPointFeeRate',
            type: 'u16',
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
      name: 'InterestRateData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'utilizationRate',
            docs: ['y=kx+b x=utilization_rate y=interest_rate'],
            type: 'i32',
          },
          {
            name: 'kValue',
            type: 'i32',
          },
          {
            name: 'bValue',
            type: 'i32',
          },
        ],
      },
    },
    {
      name: 'PositionTokenMintParam',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'collateralMint',
            docs: ['The collateral token'],
            type: 'publicKey',
          },
          {
            name: 'borrowMint',
            docs: ['The borrrow token'],
            type: 'publicKey',
          },
          {
            name: 'leverageMint',
            docs: ['The leverage token'],
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'PositionDetail',
      docs: ['collateral detailed state'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'collateralMint',
            docs: ['The collateral token'],
            type: 'publicKey',
          },
          {
            name: 'borrowMint',
            docs: ['The borrrow token'],
            type: 'publicKey',
          },
          {
            name: 'leverageMint',
            docs: ['The leverage token'],
            type: 'publicKey',
          },
          {
            name: 'collateralNote',
            docs: [
              "A note about the user's deposit tokens, used to calculate the amount of collateral deposited by the user",
            ],
            type: 'u64',
          },
          {
            name: 'collateralTokens',
            docs: ['collateral token amount'],
            type: 'u64',
          },
          {
            name: 'borrowNote',
            docs: [
              'Note about user borrow tokens, used to calculate the number of tokens the user borrows',
            ],
            type: 'u64',
          },
          {
            name: 'borrowTokens',
            docs: ['Borrowed token amount'],
            type: 'u64',
          },
          {
            name: 'leverageNote',
            docs: [
              'A note about user leverage tokens, used to calculate the number of user leverage tokens',
            ],
            type: 'u64',
          },
          {
            name: 'leverageTokens',
            docs: ['leverage token amount'],
            type: 'u64',
          },
          {
            name: 'liquidationFlag',
            docs: [
              '0 - healthy, not liquidatable; 1 - unhealthy, liquidatable',
            ],
            type: 'u64',
          },
          {
            name: 'leverageMultiples',
            docs: ['The leverage ratio of the current position'],
            type: 'u64',
          },
          {
            name: 'positionType',
            type: {
              defined: 'PositionType',
            },
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
      name: 'StakePoolWithdrawal',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'stakeAccount',
            type: 'publicKey',
          },
          {
            name: 'solAmount',
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
          {
            name: 'lstMint',
            type: {
              option: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'VSolPositionTokenParam',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'collateralToken',
            docs: ['The collateral token'],
            type: {
              defined: 'TokenInfo',
            },
          },
          {
            name: 'borrowToken',
            docs: ['The borrrow token'],
            type: {
              defined: 'TokenInfo',
            },
          },
          {
            name: 'leverageToken',
            docs: ['The leverage token'],
            type: {
              defined: 'TokenInfo',
            },
          },
        ],
      },
    },
    {
      name: 'VSolPositionDetail',
      docs: ['collateral detailed state'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'collateralMint',
            docs: ['The collateral token'],
            type: 'publicKey',
          },
          {
            name: 'borrowMint',
            docs: ['The borrrow token'],
            type: 'publicKey',
          },
          {
            name: 'leverageMint',
            docs: ['The leverage token'],
            type: 'publicKey',
          },
          {
            name: 'collateralNote',
            docs: [
              "A note about the user's deposit tokens, used to calculate the amount of collateral deposited by the user",
            ],
            type: 'u64',
          },
          {
            name: 'collateralTokens',
            docs: ['collateral token amount'],
            type: 'u64',
          },
          {
            name: 'borrowNote',
            docs: [
              'Note about user borrow tokens, used to calculate the number of tokens the user borrows',
            ],
            type: 'u64',
          },
          {
            name: 'borrowTokens',
            docs: ['Borrowed token amount'],
            type: 'u64',
          },
          {
            name: 'leverageNote',
            docs: [
              'A note about user leverage tokens, used to calculate the number of user leverage tokens',
            ],
            type: 'u64',
          },
          {
            name: 'leverageTokens',
            docs: ['leverage token amount'],
            type: 'u64',
          },
          {
            name: 'leverageMultiples',
            docs: ['The leverage ratio of the current position'],
            type: 'u64',
          },
          {
            name: 'lastPointsAndLeverageNotesRate',
            docs: [
              'The number of points that can be received for each note at the time of settlement of the last operation',
            ],
            type: 'u64',
          },
          {
            name: 'pointReward',
            docs: ['The number of points rewarded'],
            type: 'u64',
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
            name: 'Borrow',
          },
          {
            name: 'Deposit',
          },
          {
            name: 'Repay',
          },
          {
            name: 'Withdraw',
          },
          {
            name: 'Liquidate',
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
      name: 'PositionType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Normal',
          },
          {
            name: 'Solayer',
          },
          {
            name: 'Fragmetric',
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
    {
      name: 'NxSolayerError',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'InvalidTime',
          },
          {
            name: 'WithdrawalRequestLimit',
          },
          {
            name: 'StakeAccountMismatch',
          },
          {
            name: 'InvalidWithdrawalIndex',
          },
          {
            name: 'InvalidWithdrawalAmount',
          },
          {
            name: 'InvalidOperation',
          },
          {
            name: 'NoLstFound',
          },
          {
            name: 'InvalidPosition',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6e3,
      name: 'InvalidPositionIndex',
      msg: 'Invalid index of position',
    },
    {
      code: 6001,
      name: 'PositionIndexMismatch',
      msg: 'Inconsistent position index',
    },
    {
      code: 6002,
      name: 'NotAuthorized',
      msg: 'Not authorized user',
    },
    {
      code: 6003,
      name: 'NotEnoughTokens',
      msg: 'Pool is in full use',
    },
    {
      code: 6004,
      name: 'LeverageTooHigh',
      msg: 'Leverage too high',
    },
    {
      code: 6005,
      name: 'InvalidFee',
      msg: 'Invalid fee',
    },
    {
      code: 6006,
      name: 'InvalidLiquidation',
      msg: 'Invalid liquidation',
    },
    {
      code: 6007,
      name: 'LiquidateTooMuch',
      msg: 'Liquidate too much',
    },
    {
      code: 6008,
      name: 'InvalidOperation',
      msg: 'Operation leads to liquidation',
    },
    {
      code: 6009,
      name: 'InvalidAmount',
      msg: 'Invalid operation amount',
    },
    {
      code: 6010,
      name: 'InsufficientLiquidity',
      msg: 'Insufficient liquidity',
    },
    {
      code: 6011,
      name: 'NoCollateral',
      msg: 'No collateral deposited',
    },
    {
      code: 6012,
      name: 'MathOverflow',
      msg: 'Math operation overflow',
    },
    {
      code: 6013,
      name: 'TryToSerializePriceAccount',
      msg: 'Failed to serialize price account',
    },
    {
      code: 6014,
      name: 'NotStakePool',
      msg: 'Failed to deserialize stake pool account',
    },
    {
      code: 6015,
      name: 'InvalidArgument',
      msg: 'Invalid argument provided',
    },
    {
      code: 6016,
      name: 'InvalidLoanType',
      msg: 'Only one type of loan asset per account',
    },
    {
      code: 6017,
      name: 'InvalidCollateralType',
      msg: 'Only one type of collateral asset per account',
    },
    {
      code: 6018,
      name: 'PositionTypeMismatch',
      msg: 'Wrong position type provided',
    },
    {
      code: 6019,
      name: 'InvalidArgumentType',
      msg: 'Invalid argument type',
    },
    {
      code: 6020,
      name: 'PythError',
      msg: 'Could not load price account',
    },
    {
      code: 6021,
      name: 'SwitchboardError',
      msg: 'Invalid switchboard account',
    },
    {
      code: 6022,
      name: 'InvalidOracle',
      msg: 'Invalid pool oracle',
    },
    {
      code: 6023,
      name: 'InvalidExpoChange',
      msg: 'Price expo cannot be smaller than original or become positive',
    },
    {
      code: 6024,
      name: 'AddressMismatch',
      msg: 'Address Mismatch',
    },
    {
      code: 6025,
      name: 'AddressNotWhiteListed',
      msg: 'Address not in white list',
    },
    {
      code: 6026,
      name: 'ProgramMismatch',
      msg: 'Program Mismatch',
    },
    {
      code: 6027,
      name: 'DiscriminatorMismatch',
      msg: 'Discriminator mismatch',
    },
    {
      code: 6028,
      name: 'UnknownInstruction',
      msg: 'Unknown Instruction',
    },
    {
      code: 6029,
      name: 'MissingSwapInstruction',
      msg: 'Missing swap ix',
    },
    {
      code: 6030,
      name: 'MissingBeforeInstruction',
      msg: 'Missing pre-swap ix',
    },
    {
      code: 6031,
      name: 'MissingAfterInstruction',
      msg: 'Missing post-swap ix',
    },
    {
      code: 6032,
      name: 'IncorrectAccount',
      msg: 'Incorrect account',
    },
    {
      code: 6033,
      name: 'InvalidAfterAmount',
      msg: 'Invalid post amount to after ix',
    },
    {
      code: 6034,
      name: 'Paused',
      msg: 'Protocol paused',
    },
    {
      code: 6035,
      name: 'InvalidAccountDiscriminator',
      msg: 'Invalid account discriminator',
    },
    {
      code: 6036,
      name: 'UnableToDeserializeAccount',
      msg: 'Unable to deserialize account',
    },
    {
      code: 6037,
      name: 'StillHasLoans',
      msg: 'Still has loans',
    },
    {
      code: 6038,
      name: 'NotJLP',
      msg: 'Can only withdraw all for JLP',
    },
    {
      code: 6039,
      name: 'StalePrice',
      msg: 'Stale price',
    },
    {
      code: 6040,
      name: 'NeedRefreshedPoint',
      msg: 'The point has not been refreshed yet',
    },
    {
      code: 6041,
      name: 'NoPointReward',
      msg: 'No points reward',
    },
  ],
};
