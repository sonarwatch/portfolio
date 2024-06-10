export const CitrusIDL = {
  version: '0.1.0',
  name: 'citrus',
  accounts: [
    {
      name: 'collectionConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'collectionKey',
            type: {
              option: 'publicKey',
            },
          },
          {
            name: 'creators',
            type: {
              option: {
                array: ['publicKey', 3],
              },
            },
          },
          {
            name: 'merkleRoot',
            type: {
              option: {
                array: ['u8', 32],
              },
            },
          },
          {
            name: 'feeReduction',
            type: {
              option: 'u16',
            },
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
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'lender',
            type: 'publicKey',
          },
          {
            name: 'borrower',
            type: 'publicKey',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'collectionConfig',
            type: 'publicKey',
          },
          {
            name: 'status',
            type: {
              defined: 'LoanStatus',
            },
          },
          {
            name: 'loanTerms',
            type: {
              defined: 'LoanTerms',
            },
          },
          {
            name: 'creationTime',
            type: 'i64',
          },
          {
            name: 'startTime',
            type: 'i64',
          },
          {
            name: 'endTime',
            type: 'i64',
          },
          {
            name: 'fox',
            type: 'bool',
          },
          {
            name: 'mortgage',
            type: 'bool',
          },
          {
            name: 'private',
            type: 'bool',
          },
          {
            name: 'offerType',
            type: {
              defined: 'OfferType',
            },
          },
          {
            name: 'listingPrice',
            type: 'u64',
          },
          {
            name: 'ltvTerms',
            type: {
              option: {
                defined: 'LtvTerms',
              },
            },
          },
          {
            name: 'pool',
            type: 'bool',
          },
          {
            name: 'listedLoan',
            type: {
              option: {
                defined: 'ListedLoan',
              },
            },
          },
        ],
      },
    },
    {
      name: 'borrowAuthority',
      type: {
        kind: 'struct',
        fields: [],
      },
    },
  ],
  types: [
    {
      name: 'LoanTerms',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'apyBps',
            type: 'u64',
          },
          {
            name: 'duration',
            type: 'u64',
          },
          {
            name: 'principal',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'LtvTerms',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'ltvBps',
            type: 'u64',
          },
          {
            name: 'maxOffer',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'ListedLoan',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'listed',
            type: 'bool',
          },
          {
            name: 'price',
            type: 'u64',
          },
          {
            name: 'sold',
            type: 'bool',
          },
          {
            name: 'fox',
            type: 'bool',
          },
          {
            name: 'listingTime',
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'MerkleData',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'index',
            type: 'u64',
          },
          {
            name: 'proof',
            type: {
              vec: {
                array: ['u8', 32],
              },
            },
          },
        ],
      },
    },
    {
      name: 'Cpi',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'data',
            type: 'bytes',
          },
          {
            name: 'numAccounts',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'LoanStatus',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'WaitingForBorrower',
          },
          {
            name: 'WaitingForLender',
          },
          {
            name: 'Active',
          },
          {
            name: 'Repaid',
          },
          {
            name: 'Defaulted',
          },
          {
            name: 'OnSale',
          },
        ],
      },
    },
    {
      name: 'OfferType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Global',
          },
          {
            name: 'Mortgage',
          },
          {
            name: 'Borrow',
          },
        ],
      },
    },
  ],
};
