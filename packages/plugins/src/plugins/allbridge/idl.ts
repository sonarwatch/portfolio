export const AllbridgeIDL = {
  version: '0.1.0',
  name: 'bridge',
  accounts: [
    {
      name: 'chainBridge',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'address',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'chainId',
            type: 'u8',
          },
          {
            name: 'gasUsage',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'config',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admin',
            type: 'publicKey',
          },
          {
            name: 'allbridgeMessengerProgramId',
            type: 'publicKey',
          },
          {
            name: 'wormholeMessengerProgramId',
            type: 'publicKey',
          },
          {
            name: 'gasOracleProgramId',
            type: 'publicKey',
          },
          {
            name: 'rebalancer',
            type: 'publicKey',
          },
          {
            name: 'stopAuthority',
            type: 'publicKey',
          },
          {
            name: 'authorityBumpSeed',
            type: 'u8',
          },
          {
            name: 'canSwap',
            type: 'bool',
          },
          {
            name: 'canDeposit',
            type: 'bool',
          },
          {
            name: 'canWithdraw',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'lock',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'sender',
            type: 'publicKey',
          },
          {
            name: 'sentTokenAddress',
            type: 'publicKey',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'vusdAmount',
            type: 'u64',
          },
          {
            name: 'recipient',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'destinationChainId',
            type: 'u8',
          },
          {
            name: 'receiveToken',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'nonce',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'messenger',
            type: {
              defined: 'Messenger',
            },
          },
          {
            name: 'slot',
            type: 'u64',
          },
          {
            name: 'fee',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'otherBridgeToken',
      type: {
        kind: 'struct',
        fields: [],
      },
    },
    {
      name: 'pool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'a',
            type: 'u64',
          },
          {
            name: 'd',
            type: 'u64',
          },
          {
            name: 'tokenBalance',
            type: 'u64',
          },
          {
            name: 'vUsdBalance',
            type: 'u64',
          },
          {
            name: 'reserves',
            type: 'u64',
          },
          {
            name: 'decimals',
            type: 'u8',
          },
          {
            name: 'totalLpAmount',
            type: 'u64',
          },
          {
            name: 'feeShareBp',
            type: 'u64',
          },
          {
            name: 'adminFeeShareBp',
            type: 'u64',
          },
          {
            name: 'accRewardPerShareP',
            type: 'u128',
          },
          {
            name: 'adminFeeAmount',
            type: 'u64',
          },
          {
            name: 'balanceRatioMinBp',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'unlock',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'hash',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'fee',
            type: 'u64',
          },
          {
            name: 'vUsdAmount',
            type: 'u64',
          },
          {
            name: 'slot',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'userDeposit',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'userAddress',
            type: 'publicKey',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'lpAmount',
            type: 'u64',
          },
          {
            name: 'rewardDebt',
            type: 'u64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'RegisterChainBridgeArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'chainBridgeAddress',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'chainId',
            type: 'u8',
          },
          {
            name: 'gasUsage',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'UpdateChainBridgeArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'chainBridgeAddress',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'chainId',
            type: 'u8',
          },
          {
            name: 'gasUsage',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'InitializeArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'allbridgeMessengerProgramId',
            type: 'publicKey',
          },
          {
            name: 'wormholeMessengerProgramId',
            type: 'publicKey',
          },
          {
            name: 'gasOracleProgramId',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'InitializePoolArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'a',
            type: 'u64',
          },
          {
            name: 'feeShareBp',
            type: 'u64',
          },
          {
            name: 'adminFeeShareBp',
            type: 'u64',
          },
          {
            name: 'balanceRatioMinBp',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'BridgeArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nonce',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'recipient',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'destinationChainId',
            type: 'u8',
          },
          {
            name: 'receiveToken',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'vusdAmount',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'UnlockArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nonce',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'recipient',
            type: 'publicKey',
          },
          {
            name: 'sourceChainId',
            type: 'u8',
          },
          {
            name: 'receiveToken',
            type: 'publicKey',
          },
          {
            name: 'messenger',
            type: {
              defined: 'Messenger',
            },
          },
          {
            name: 'hash',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'receiveAmountMin',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'RewardError',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'FeeTooHigh',
          },
        ],
      },
    },
    {
      name: 'Messenger',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Allbridge',
          },
          {
            name: 'Wormhole',
          },
        ],
      },
    },
    {
      name: 'ActionType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Deposit',
          },
          {
            name: 'Withdraw',
          },
          {
            name: 'Swap',
          },
        ],
      },
    },
  ],
};
