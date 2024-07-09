export const NxfinanceLeverageIDL = {
  version: '0.1.0',
  name: 'leverage_finance',
  constants: [
    {
      name: 'AUTHORITY_SEED',
      type: 'string',
      value: '"authority"',
    },
    {
      name: 'MARGIN_ACCOUNT_SEED',
      type: 'string',
      value: '"account"',
    },
    {
      name: 'JUPITER_SEED',
      type: 'string',
      value: '"jupiter"',
    },
    {
      name: 'JUPITER_ACCOUNT_SEED',
      type: 'string',
      value: '"jupiteraccount"',
    },
    {
      name: 'MAX_LEVERAGE',
      type: 'u64',
      value: '1000',
    },
    {
      name: 'STALENESS_THRESHOLD',
      type: 'u64',
      value: '60',
    },
    {
      name: 'LIQUIDATE_THRESHOLD',
      type: 'u64',
      value: '95',
    },
    {
      name: 'ADMIN',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("DHyLVVYKPv1JJMQWxL3rA6RYF5MzUPdaCpBR2XSL8z2Q")',
    },
    {
      name: 'JUPITER_SWAP',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4")',
    },
    {
      name: 'JLP_MINT',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4")',
    },
    {
      name: 'USDC_MINT',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")',
    },
    {
      name: 'USDC_ORACLE',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD")',
    },
    {
      name: 'JLP_ORACLE',
      type: 'publicKey',
      value:
        'solana_program :: pubkey ! ("5BUwFW4nRbftYTDMbgxykoFWqWHPzahFSNAaaaJtVKsq")',
    },
    {
      name: 'PUBKEY_DEFAULT',
      type: 'publicKey',
      value: 'solana_program :: pubkey ! ("11111111111111111111111111111111")',
    },
    {
      name: '_SWAP_DISCRIMINATOR_EXACT_IN',
      type: {
        array: ['u8', 8],
      },
      value: '[193 , 32 , 155 , 51 , 65 , 214 , 156 , 129]',
    },
    {
      name: '_SWAP_DISCRIMINATOR_EXACT_OUT',
      type: {
        array: ['u8', 8],
      },
      value: '[176 , 209 , 105 , 168 , 154 , 125 , 69 , 62]',
    },
  ],
  instructions: [
    {
      name: 'createLeveragefi',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'admin',
          isMut: !1,
          isSigner: !1,
          docs: ['The admin of the LeverageFi'],
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
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
          name: 'id',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'createPool',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'marginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to be created'],
        },
        {
          name: 'tokenPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'poolAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'vault',
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
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The payer of rent for new accounts'],
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
          name: 'feeDestination',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'registerJupiter',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'jupiterAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jupiter account to be created'],
        },
        {
          name: 'jupiterAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'jlpAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The token account holding JLP'],
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The payer of rent for new accounts'],
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
      name: 'deposit',
      docs: ['* amount: token amount'],
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'marginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to deposit into'],
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'poolAuthority',
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
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'depositor',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
        },
        {
          name: 'depositorTokenMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The source of the tokens to be deposited'],
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The margin account for depositor'],
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
      name: 'borrow',
      docs: ['* amount: token amount'],
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'marginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to borrow from'],
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'poolAuthority',
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
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'borrower',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
        },
        {
          name: 'borrowerTokenMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
        },
        {
          name: 'payer',
          isMut: !0,
          isSigner: !0,
          docs: ['The account paying for all rents'],
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
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'afterBorrow',
      docs: ['* jlp_amount: jlp amount'],
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'marginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to borrow from'],
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
        },
        {
          name: 'jupiterAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jupiter account to receive the leveraged loan tokens'],
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'borrowerJlpMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for borrower'],
        },
        {
          name: 'jupiterJlpMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for jupiter account'],
        },
        {
          name: 'jupiterAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'borrower',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
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
          name: 'jlpAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'repay',
      docs: ['* amount: token amount'],
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'marginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to borrow from'],
        },
        {
          name: 'jlpMarginPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
        },
        {
          name: 'jupiterAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jupiter account to send the leveraged loan tokens'],
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'jlpPoolAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Token account holding JLP margin pool deposits'],
        },
        {
          name: 'repayerJlpMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for repayer'],
        },
        {
          name: 'jupiterJlpMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for jupiter account'],
        },
        {
          name: 'jupiterAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'repayer',
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
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'afterRepay',
      docs: ['* amount: token amount'],
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'marginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to borrow from'],
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'repayerTokenMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for repayer'],
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
          name: 'repayer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
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
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'withdraw',
      docs: ['* amount: token amount'],
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'usdcMarginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to borrow from'],
        },
        {
          name: 'jlpMarginPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'poolAuthority',
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
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'withdrawer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
        },
        {
          name: 'depositorTokenMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The destination of the tokens to be withdrawn'],
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
        },
        {
          name: 'feeDestination',
          isMut: !0,
          isSigner: !1,
          docs: ['Fee receiver'],
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
      name: 'withdrawAll',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'usdcMarginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['The pool to borrow from'],
        },
        {
          name: 'jlpMarginPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'poolAuthority',
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
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'withdrawer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
        },
        {
          name: 'depositorTokenMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The destination of the tokens to be withdrawn'],
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
        },
        {
          name: 'feeDestination',
          isMut: !0,
          isSigner: !1,
          docs: ['Fee receiver'],
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
      args: [],
    },
    {
      name: 'liquidate',
      docs: ['* amount: token amount'],
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'usdcMarginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['Pool where USDC is borrowed from'],
        },
        {
          name: 'jlpMarginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['Pool where JLP is deposited as collateral'],
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
        },
        {
          name: 'jupiterAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jupiter account to send the leveraged loan tokens'],
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPoolAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Token account holding JLP margin pool deposits'],
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'usdcMint',
          isMut: !1,
          isSigner: !1,
          docs: ['Mint for USDC'],
        },
        {
          name: 'liquidatorJlpMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for jupiter account'],
        },
        {
          name: 'jupiterAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jupiterJlpMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for jupiter account'],
        },
        {
          name: 'liquidatee',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'liquidator',
          isMut: !0,
          isSigner: !0,
          docs: ['The address with authority to the liquidator rewards'],
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
      args: [],
    },
    {
      name: 'afterLiquidate',
      docs: ['* amount: token amount'],
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'usdcMarginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['Pool where USDC is borrowed from'],
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
        },
        {
          name: 'usdcMint',
          isMut: !1,
          isSigner: !1,
          docs: ['Mint for USDC'],
        },
        {
          name: 'liquidatorUsdcMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The usdc_mint account for liquidator'],
        },
        {
          name: 'liquidateeUsdcMintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'usdcVault',
          isMut: !0,
          isSigner: !1,
          docs: ['Token account holding the USDC margin pool deposits'],
        },
        {
          name: 'liquidatee',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'liquidator',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to the liquidator rewards'],
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
          name: 'swapAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'jlpWithdraw',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !1,
          isSigner: !1,
          docs: ['The LeverageFi platform'],
        },
        {
          name: 'usdcMarginPool',
          isMut: !0,
          isSigner: !1,
          docs: ['Pool where USDC is borrowed from'],
        },
        {
          name: 'usdcPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jlpPriceOracle',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'jupiterAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jupiter account recording jlp notes and jupiter info'],
        },
        {
          name: 'jupiterAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'jlpMint',
          isMut: !1,
          isSigner: !1,
          docs: ['The mint for JLP token'],
        },
        {
          name: 'jupiterJlpMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for jupiter account'],
        },
        {
          name: 'withdrawer',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority to deposit the tokens'],
        },
        {
          name: 'withdrawerJlpMintAccount',
          isMut: !0,
          isSigner: !1,
          docs: ['The jlp_mint account for withdrawer'],
        },
        {
          name: 'feeDestination',
          isMut: !0,
          isSigner: !1,
          docs: ['token account for fees, ATA for JLP'],
        },
        {
          name: 'marginAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'The margin account for borrower, which was initialized at the first deposit',
          ],
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
      name: 'setPenaltyInterestRate',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'user',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority'],
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
          name: 'penaltyInterestRate',
          type: 'u16',
        },
      ],
    },
    {
      name: 'setWithdrawFeeRate',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'user',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority'],
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
          name: 'withdrawFeeRate',
          type: 'u16',
        },
      ],
    },
    {
      name: 'setProtocolFeeRate',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'user',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority'],
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
          name: 'protocolFeeRate',
          type: 'u16',
        },
      ],
    },
    {
      name: 'setPaused',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'user',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority'],
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
          name: 'pause',
          type: 'bool',
        },
      ],
    },
    {
      name: 'setSwapSlippage',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'user',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority'],
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
          name: 'slippage',
          type: 'u16',
        },
      ],
    },
    {
      name: 'claimProtocolFee',
      accounts: [
        {
          name: 'leveragefi',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'usdcMarginPool',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'poolAuthority',
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
          name: 'admin',
          isMut: !1,
          isSigner: !0,
          docs: ['The address with authority'],
        },
        {
          name: 'usdcMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'adminUsdcMintAccount',
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
          name: 'amount',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'leveragefi',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'id',
            docs: ['The primary key of the leverage finance'],
            type: 'publicKey',
          },
          {
            name: 'admin',
            docs: ['Account that has admin authority over the leveragefi'],
            type: 'publicKey',
          },
          {
            name: 'paused',
            docs: ['Disable all protocol operations'],
            type: 'bool',
          },
          {
            name: 'swapSlippage',
            type: 'u16',
          },
          {
            name: 'jlpInterestRate',
            docs: [
              'The jlp interest rate, basic unit for margin interest calculation',
            ],
            type: 'u16',
          },
          {
            name: 'penaltyInterestRate',
            docs: ['Penalty interest point'],
            type: 'u16',
          },
          {
            name: 'liquidationReward',
            type: 'u16',
          },
          {
            name: 'withdrawFeeRate',
            docs: ['jlp withdraw fee rate for taking profit, 10000 as unit'],
            type: 'u16',
          },
          {
            name: 'protocolFeeRate',
            docs: ['interest fee rate, 10000 as unit'],
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'jupiterAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'leveragefi',
            docs: ['Primary key of the LeverageFi to create pool'],
            type: 'publicKey',
          },
          {
            name: 'admin',
            docs: ['Account that has admin authority over the account'],
            type: 'publicKey',
          },
          {
            name: 'jlpMint',
            docs: ['The JLP token mint'],
            type: 'publicKey',
          },
          {
            name: 'jlpAccount',
            docs: ['The JLP token account'],
            type: 'publicKey',
          },
          {
            name: 'jupiterNotes',
            docs: ['The total amount of notes issued to jupiter account users'],
            type: 'u64',
          },
          {
            name: 'jlpPosition',
            docs: [
              'The total amount of JLP position, currently unused, value: 0',
            ],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'marginPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'leveragefi',
            docs: ['Primary key of the LeverageFi to create pool'],
            type: 'publicKey',
          },
          {
            name: 'vault',
            docs: [
              'The address of the vault account, which has custody of the',
              "pool's tokens",
            ],
            type: 'publicKey',
          },
          {
            name: 'feeDestination',
            docs: [
              'The address of the account to deposit collected fees, represented as',
              'deposit notes',
            ],
            type: 'publicKey',
          },
          {
            name: 'poolAuthority',
            docs: ['The pool authority to act'],
            type: 'publicKey',
          },
          {
            name: 'tokenMint',
            docs: ['The token the pool allows lending and borrowing on'],
            type: 'publicKey',
          },
          {
            name: 'tokenPriceOracle',
            docs: [
              'The address of the pyth oracle with price information for the token',
            ],
            type: 'publicKey',
          },
          {
            name: 'borrowedTokens',
            docs: [
              'The total amount of tokens borrowed, that need to be repaid to',
              'the pool.',
            ],
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
            name: 'loanNotes',
            docs: ['The total amount of notes issued to borrowers of tokens'],
            type: 'u64',
          },
          {
            name: 'depositInterest',
            docs: [
              'Amount of unpaid interest to depositors, for deposit note exchange rate calculation',
            ],
            type: 'u64',
          },
          {
            name: 'loanInterest',
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
        ],
      },
    },
    {
      name: 'marginAccount',
      docs: ['User margin state, with collateral & loan details'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'leveragefi',
            docs: ['Primary key of the LeverageFi to create pool'],
            type: 'publicKey',
          },
          {
            name: 'owner',
            docs: ['Owner authority which can borrow liquidity'],
            type: 'publicKey',
          },
          {
            name: 'deposits',
            docs: ['Deposited collateral, unique by deposit reserve address'],
            type: {
              vec: {
                defined: 'CollateralDetail',
              },
            },
          },
          {
            name: 'loans',
            docs: ['Borrowed liquidity, unique by borrow reserve address'],
            type: {
              vec: {
                defined: 'LoanDetail',
              },
            },
          },
          {
            name: 'leverage',
            docs: ['Leverage info'],
            type: 'u64',
          },
          {
            name: 'jlpNotes',
            docs: [
              'Holding JLP quota, JLP obtained from swapping borrowed USDC',
            ],
            type: 'u64',
          },
          {
            name: 'activeLoan',
            docs: [
              'Loan asset used for leverage, each account can only borrow one type of asset',
              'Resets to PUBKEY_DEFAULT upon repaying all loan with interest',
            ],
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'pool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'custodies',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'aumUsd',
            docs: ['Pool value in usd scaled by 6 decimals'],
            type: 'u128',
          },
          {
            name: 'limit',
            type: {
              defined: 'Limit',
            },
          },
          {
            name: 'fees',
            type: {
              defined: 'Fees',
            },
          },
          {
            name: 'poolApr',
            type: {
              defined: 'PoolApr',
            },
          },
          {
            name: 'maxRequestExecutionSec',
            type: 'i64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'lpTokenBump',
            type: 'u8',
          },
          {
            name: 'inceptionTime',
            type: 'i64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'CollateralDetail',
      docs: ['collateral detailed state'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenMint',
            docs: ['The deposited token'],
            type: 'publicKey',
          },
          {
            name: 'depositNote',
            docs: ['Amount of collateral deposited, deposit note'],
            type: 'u64',
          },
          {
            name: 'depositToken',
            docs: ['Amount of collateral deposited, token'],
            type: 'u64',
          },
          {
            name: 'marketValue',
            docs: ['Total value of deposits, front-end use only'],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'LoanDetail',
      docs: ['Obligation liquidity state'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenMint',
            docs: ['The borrowed token'],
            type: 'publicKey',
          },
          {
            name: 'loanNote',
            docs: ['Amount of asset loan, loan note'],
            type: 'u64',
          },
          {
            name: 'loanToken',
            docs: ['Amount of asset loan, token'],
            type: 'u64',
          },
          {
            name: 'loanValue',
            docs: ['Total value of loan, front-end use only'],
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
      name: 'Limit',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'maxAumUsd',
            type: 'u128',
          },
          {
            name: 'maxIndividualLpToken',
            type: 'u128',
          },
          {
            name: 'maxPositionUsd',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'Fees',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'increasePositionBps',
            type: 'u64',
          },
          {
            name: 'decreasePositionBps',
            type: 'u64',
          },
          {
            name: 'addRemoveLiquidityBps',
            type: 'u64',
          },
          {
            name: 'swapBps',
            type: 'u64',
          },
          {
            name: 'taxBps',
            type: 'u64',
          },
          {
            name: 'stableSwapBps',
            type: 'u64',
          },
          {
            name: 'stableSwapTaxBps',
            type: 'u64',
          },
          {
            name: 'liquidationRewardBps',
            type: 'u64',
          },
          {
            name: 'protocolShareBps',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'PoolApr',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'lastUpdated',
            type: 'i64',
          },
          {
            name: 'feeAprBps',
            type: 'u64',
          },
          {
            name: 'realizedFeeUsd',
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
  ],
  errors: [
    {
      code: 6e3,
      name: 'NotAuthorized',
      msg: 'Not authorized user',
    },
    {
      code: 6001,
      name: 'NotEnoughTokens',
      msg: 'Pool is in full use',
    },
    {
      code: 6002,
      name: 'LeverageTooHigh',
      msg: 'Leverage too high',
    },
    {
      code: 6003,
      name: 'InvalidFee',
      msg: 'Invalid fee',
    },
    {
      code: 6004,
      name: 'InvalidLiquidation',
      msg: 'Invalid liquidation',
    },
    {
      code: 6005,
      name: 'LiquidateTooMuch',
      msg: 'Liquidate too much',
    },
    {
      code: 6006,
      name: 'InvalidOperation',
      msg: 'Operation leads to liquidation',
    },
    {
      code: 6007,
      name: 'InvalidAmount',
      msg: 'Invalid operation amount',
    },
    {
      code: 6008,
      name: 'InsufficientLiquidity',
      msg: 'Insufficient liquidity',
    },
    {
      code: 6009,
      name: 'NoCollateral',
      msg: 'No JLP collateral deposited',
    },
    {
      code: 6010,
      name: 'MathOverflow',
      msg: 'Math operation overflow',
    },
    {
      code: 6011,
      name: 'PythError',
      msg: 'Could not load price account',
    },
    {
      code: 6012,
      name: 'TryToSerializePriceAccount',
      msg: 'Failed to serialize price account',
    },
    {
      code: 6013,
      name: 'InvalidArgument',
      msg: 'Invalid argument provided',
    },
    {
      code: 6014,
      name: 'InvalidOracle',
      msg: 'Invalid pool oracle',
    },
    {
      code: 6015,
      name: 'InvalidLoanType',
      msg: 'Only one type of loan asset per account',
    },
    {
      code: 6016,
      name: 'AddressMismatch',
      msg: 'Address Mismatch',
    },
    {
      code: 6017,
      name: 'ProgramMismatch',
      msg: 'Program Mismatch',
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
      name: 'MissingAfterInstruction',
      msg: 'Missing post-swap ix',
    },
    {
      code: 6021,
      name: 'IncorrectAccount',
      msg: 'Incorrect account',
    },
    {
      code: 6022,
      name: 'InvalidAfterAmount',
      msg: 'Invalid amount provided to post-swap ix',
    },
    {
      code: 6023,
      name: 'Paused',
      msg: 'Protocol paused',
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
    {
      code: 6026,
      name: 'StillHasLoans',
      msg: 'Still has loans',
    },
    {
      code: 6027,
      name: 'NotJLP',
      msg: 'Can only withdraw all for JLP',
    },
    {
      code: 6028,
      name: 'StalePrice',
      msg: 'Stale price',
    },
  ],
};
