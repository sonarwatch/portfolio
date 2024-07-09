export const tokenMarketIdl = {
  version: '0.1.0',
  name: 'wlmarket',
  instructions: [
    {
      name: 'addItem',
      accounts: [
        {
          name: 'item',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'mint',
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
        {
          name: 'foxy',
          type: 'bool',
        },
      ],
    },
    {
      name: 'updateItem',
      accounts: [
        {
          name: 'item',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'mint',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'cost',
          type: 'u64',
        },
      ],
    },
    {
      name: 'listItem',
      accounts: [
        {
          name: 'item',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'mint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintMarketAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
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
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'cost',
          type: 'u64',
        },
      ],
    },
    {
      name: 'delistItem',
      accounts: [
        {
          name: 'item',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'mint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintMarketAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
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
      name: 'closeItem',
      accounts: [
        {
          name: 'item',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'signer',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'mint',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'buyItem',
      accounts: [
        {
          name: 'item',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'signer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'payment',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintMarketAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintUserAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'foxy',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'sellerFoxyAccount',
          isMut: !0,
          isSigner: !1,
          isOptional: !0,
        },
        {
          name: 'buyerFoxyAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
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
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'price',
          type: 'u64',
        },
      ],
    },
    {
      name: 'kickItem',
      accounts: [
        {
          name: 'item',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'authority',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mintMarketAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
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
      name: 'createOrder',
      accounts: [
        {
          name: 'order',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'mint',
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
          name: 'cost',
          type: 'u64',
        },
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'foxy',
          type: 'bool',
        },
        {
          name: 'expiry',
          type: 'u64',
        },
      ],
    },
    {
      name: 'cancelOrder',
      accounts: [
        {
          name: 'order',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !0,
        },
      ],
      args: [],
    },
    {
      name: 'updateOrder',
      accounts: [
        {
          name: 'order',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'owner',
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
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'cost',
          type: 'u64',
        },
        {
          name: 'expiry',
          type: 'u64',
        },
      ],
    },
    {
      name: 'fillOrder',
      accounts: [
        {
          name: 'order',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'seller',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'sellerAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'buyerAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'payment',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'associatedTokenProgram',
          isMut: !1,
          isSigner: !1,
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
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'price',
          type: 'u64',
        },
      ],
    },
    {
      name: 'closeOrder',
      accounts: [
        {
          name: 'order',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'mint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'owner',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'signer',
          isMut: !1,
          isSigner: !0,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'item',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'cost',
            type: 'u64',
          },
          {
            name: 'count',
            type: 'u64',
          },
          {
            name: 'foxy',
            type: 'bool',
          },
          {
            name: 'staked',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'order',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'cost',
            type: 'u64',
          },
          {
            name: 'count',
            type: 'u64',
          },
          {
            name: 'foxy',
            type: 'bool',
          },
          {
            name: 'time',
            type: 'u64',
          },
          {
            name: 'expiry',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'fox',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'fox',
            type: 'publicKey',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'tff',
            type: 'bool',
          },
          {
            name: 'other',
            type: 'bool',
          },
          {
            name: 'xp',
            type: 'u64',
          },
          {
            name: 'missions',
            type: 'u64',
          },
          {
            name: 'multiplier',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'stakingAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'fox',
            type: 'publicKey',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'lock',
            type: 'i64',
          },
          {
            name: 'lastClaim',
            type: 'i64',
          },
          {
            name: 'tff',
            type: 'bool',
          },
          {
            name: 'v2',
            type: 'bool',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'Sale',
      fields: [
        {
          name: 'mint',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'seller',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'buyer',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'amount',
          type: 'u64',
          index: !1,
        },
        {
          name: 'cost',
          type: 'u64',
          index: !1,
        },
        {
          name: 'foxy',
          type: 'bool',
          index: !1,
        },
        {
          name: 'fill',
          type: 'bool',
          index: !1,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6e3,
      name: 'InsufficientBalance',
      msg: 'Insufficient SOL balance',
    },
    {
      code: 6001,
      name: 'InsufficientItemBalance',
      msg: 'Insufficient item balance',
    },
    {
      code: 6002,
      name: 'PriceUpdated',
      msg: 'Price Updated',
    },
    {
      code: 6003,
      name: 'InvalidPrice',
      msg: 'Invalid Price',
    },
    {
      code: 6004,
      name: 'InvalidQty',
      msg: 'Invalid Qty',
    },
    {
      code: 6005,
      name: 'InvalidStake',
      msg: 'Invalid Stake',
    },
    {
      code: 6006,
      name: 'InvalidAmount',
      msg: 'Invalid Amount',
    },
    {
      code: 6007,
      name: 'OrderExpired',
      msg: 'Order expired',
    },
  ],
};
