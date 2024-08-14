export const quarryRedeemerIdl = {
  version: '5.0.2',
  name: 'quarry_redeemer',
  instructions: [
    {
      name: 'createRedeemer',
      accounts: [
        {
          name: 'redeemer',
          isMut: !0,
          isSigner: !1,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Redeemer',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'iou_mint',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'redemption_mint',
              },
            ],
          },
        },
        {
          name: 'iouMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'redemptionMint',
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
      args: [
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'redeemTokens',
      accounts: [
        {
          name: 'redeemer',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'sourceAuthority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'iouMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'iouSource',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'redemptionVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'redemptionDestination',
          isMut: !0,
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
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'redeemAllTokens',
      accounts: [
        {
          name: 'redeemer',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'sourceAuthority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'iouMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'iouSource',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'redemptionVault',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'redemptionDestination',
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
      name: 'Redeemer',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'iouMint',
            type: 'publicKey',
          },
          {
            name: 'redemptionMint',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'totalTokensRedeemed',
            type: 'u64',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'RedeemTokensEvent',
      fields: [
        {
          name: 'user',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'iouMint',
          type: 'publicKey',
          index: !1,
        },
        {
          name: 'redemptionMint',
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
  ],
  errors: [
    {
      code: 6e3,
      name: 'Unauthorized',
      msg: 'Unauthorized.',
    },
  ],
};
