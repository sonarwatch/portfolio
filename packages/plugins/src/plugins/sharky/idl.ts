export const SharkyIDL = {
  version: '6.3.0',
  name: 'sharky',
  instructions: [],
  accounts: [
    {
      name: 'orderBook',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'version',
            type: 'u8',
          },
          {
            name: 'orderBookType',
            type: {
              defined: 'OrderBookType',
            },
          },
          {
            name: 'apy',
            type: {
              defined: 'APY',
            },
          },
          {
            name: 'loanTerms',
            type: {
              defined: 'BookLoanTerms',
            },
          },
          {
            name: 'feePermillicentage',
            type: 'u16',
          },
          {
            name: 'feeAuthority',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'loan',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'version',
            type: 'u8',
          },
          {
            name: 'principalLamports',
            docs: ['amount in tokens, decimals included'],
            type: 'u64',
          },
          {
            name: 'orderBook',
            type: 'publicKey',
          },
          {
            name: 'valueTokenMint',
            docs: ['Token mint for what the loan is in (spl address)'],
            type: 'publicKey',
          },
          {
            name: 'escrowBumpSeed',
            type: 'u8',
          },
          {
            name: 'loanState',
            docs: ['stores start and duration'],
            type: {
              defined: 'LoanState',
            },
          },
        ],
      },
    },
    {
      name: 'nftList',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'version',
            type: 'u8',
          },
          {
            name: 'collectionName',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'escrowPda',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'programVersion',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'version',
            type: 'u8',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'updated',
            type: 'i64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'CnftArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'cnftRoot',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'cnftDataHash',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'cnftCreatorHash',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'cnftNonce',
            type: 'u64',
          },
          {
            name: 'cnftIndex',
            type: 'u32',
          },
        ],
      },
    },
    {
      name: 'UpdateIndex',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'index',
            type: 'u32',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'LoanOffer',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'lenderWallet',
            type: 'publicKey',
          },
          {
            name: 'termsSpec',
            type: {
              defined: 'LoanTermsSpec',
            },
          },
          {
            name: 'offerTime',
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'TakenLoan',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nftCollateralMint',
            type: 'publicKey',
          },
          {
            name: 'lenderNoteMint',
            type: 'publicKey',
          },
          {
            name: 'borrowerNoteMint',
            type: 'publicKey',
          },
          {
            name: 'apy',
            docs: [
              'Thousandths of a percent (allows to have 3 decimal points of precision)',
            ],
            type: {
              defined: 'APY',
            },
          },
          {
            name: 'terms',
            type: {
              defined: 'LoanTerms',
            },
          },
          {
            name: 'isCollateralFrozen',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'APY',
      docs: ['APY settings on an [`OrderBook`]'],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Fixed',
            fields: [
              {
                name: 'apy',
                docs: ['Thousandths of a percent'],
                type: 'u32',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'BookLoanTerms',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Fixed',
            fields: [
              {
                name: 'terms',
                type: {
                  defined: 'LoanTermsSpec',
                },
              },
            ],
          },
          {
            name: 'LenderChooses',
          },
        ],
      },
    },
    {
      name: 'LoanTermsSpec',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Time',
            fields: [
              {
                name: 'duration',
                type: 'u64',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'OrderBookType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Collection',
            fields: [
              {
                name: 'collection_key',
                type: 'publicKey',
              },
            ],
          },
          {
            name: 'NFTList',
            fields: [
              {
                name: 'list_account',
                type: 'publicKey',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'LoanTerms',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Time',
            fields: [
              {
                name: 'start',
                docs: ['This is a [`UnixTimeStamp`]'],
                type: 'i64',
              },
              {
                name: 'duration',
                type: 'u64',
              },
              {
                name: 'total_owed_lamports',
                type: 'u64',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'LoanState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Offer',
            fields: [
              {
                name: 'offer',
                type: {
                  defined: 'LoanOffer',
                },
              },
            ],
          },
          {
            name: 'Taken',
            fields: [
              {
                name: 'taken',
                type: {
                  defined: 'TakenLoan',
                },
              },
            ],
          },
        ],
      },
    },
  ],
  errors: [],
};
