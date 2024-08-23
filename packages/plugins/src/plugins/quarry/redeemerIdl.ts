export const redeemerIdl = {
  version: '1.1.2',
  name: 'redeemer',
  instructions: [
    {
      name: 'createRedeemer',
      accounts: [
        {
          name: 'redeemer',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokens',
          accounts: [
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
              name: 'redemptionVault',
              isMut: !1,
              isSigner: !1,
            },
          ],
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
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'tokens',
          accounts: [
            {
              name: 'iouMint',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'redemptionMint',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'redemptionVault',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'tokenProgram',
              isMut: !1,
              isSigner: !1,
            },
          ],
        },
        {
          name: 'sourceAuthority',
          isMut: !1,
          isSigner: !0,
        },
        {
          name: 'iouSource',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'redemptionDestination',
          isMut: !0,
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
      name: 'redeemTokensFromMintProxy',
      accounts: [
        {
          name: 'redeemCtx',
          accounts: [
            {
              name: 'redeemer',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'tokens',
              accounts: [
                {
                  name: 'iouMint',
                  isMut: !0,
                  isSigner: !1,
                },
                {
                  name: 'redemptionMint',
                  isMut: !0,
                  isSigner: !1,
                },
                {
                  name: 'redemptionVault',
                  isMut: !0,
                  isSigner: !1,
                },
                {
                  name: 'tokenProgram',
                  isMut: !1,
                  isSigner: !1,
                },
              ],
            },
            {
              name: 'sourceAuthority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'iouSource',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'redemptionDestination',
              isMut: !0,
              isSigner: !1,
            },
          ],
        },
        {
          name: 'mintProxyState',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'proxyMintAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mintProxyProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'minterInfo',
          isMut: !0,
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
      name: 'redeemAllTokensFromMintProxy',
      accounts: [
        {
          name: 'redeemCtx',
          accounts: [
            {
              name: 'redeemer',
              isMut: !1,
              isSigner: !1,
            },
            {
              name: 'tokens',
              accounts: [
                {
                  name: 'iouMint',
                  isMut: !0,
                  isSigner: !1,
                },
                {
                  name: 'redemptionMint',
                  isMut: !0,
                  isSigner: !1,
                },
                {
                  name: 'redemptionVault',
                  isMut: !0,
                  isSigner: !1,
                },
                {
                  name: 'tokenProgram',
                  isMut: !1,
                  isSigner: !1,
                },
              ],
            },
            {
              name: 'sourceAuthority',
              isMut: !1,
              isSigner: !0,
            },
            {
              name: 'iouSource',
              isMut: !0,
              isSigner: !1,
            },
            {
              name: 'redemptionDestination',
              isMut: !0,
              isSigner: !1,
            },
          ],
        },
        {
          name: 'mintProxyState',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'proxyMintAuthority',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'mintProxyProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'minterInfo',
          isMut: !0,
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
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'iouMint',
            type: 'publicKey',
          },
          {
            name: 'redemptionMint',
            type: 'publicKey',
          },
          {
            name: 'redemptionVault',
            type: 'publicKey',
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
          name: 'destinationMint',
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
  ],
  errors: [
    {
      code: 6e3,
      name: 'Unauthorized',
      msg: 'Unauthorized.',
    },
    {
      code: 6001,
      name: 'DecimalsMismatch',
      msg: 'Redemption token and IOU token decimals must match',
    },
  ],
};
