export const idls = {
  version: '0.1.0',
  name: 'zeta_staking',
  instructions: [
    {
      name: 'initProtocol',
      accounts: [
        {
          name: 'protocolState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'zetaMint',
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
          name: 'epochDurationSeconds',
          type: 'u32',
        },
        {
          name: 'maxNEpochs',
          type: 'u32',
        },
        {
          name: 'minStakeDurationEpochs',
          type: 'u32',
        },
      ],
    },
    {
      name: 'udpateAuthority',
      accounts: [
        {
          name: 'protocolState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'newAuthority',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'initStakeAccountManager',
      accounts: [
        {
          name: 'stakeAccountManager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
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
      name: 'stake',
      accounts: [
        {
          name: 'protocolState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'zetaTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccountManager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'zetaMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bitToUse',
          type: 'u8',
        },
        {
          name: 'stakeDurationEpochs',
          type: 'u32',
        },
        {
          name: 'amountToStake',
          type: 'u64',
        },
        {
          name: 'stakeAccName',
          type: 'string',
        },
      ],
    },
    {
      name: 'toggleStakeAccount',
      accounts: [
        {
          name: 'protocolState',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'editStakeAccountName',
      accounts: [
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'newStakeAccName',
          type: 'string',
        },
      ],
    },
    {
      name: 'claim',
      accounts: [
        {
          name: 'protocolState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccountManager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userZetaTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'extendLockupDuration',
      accounts: [
        {
          name: 'protocolState',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'epochsToExtend',
          type: 'u32',
        },
      ],
    },
    {
      name: 'addStake',
      accounts: [
        {
          name: 'protocolState',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userZetaTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'stakeToAdd',
          type: 'u64',
        },
      ],
    },
    {
      name: 'mergeStakeAccounts',
      accounts: [
        {
          name: 'protocolState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccountManager',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeAccountToMerge',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'stakeVaultToMerge',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'ProtocolState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'epochDurationSeconds',
            type: 'u32',
          },
          {
            name: 'maxNEpochs',
            type: 'u32',
          },
          {
            name: 'minStakeDurationEpochs',
            type: 'u32',
          },
          {
            name: 'epochZeroTs',
            type: 'u64',
          },
          {
            name: 'zetaMint',
            type: 'publicKey',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'StakeAccountManager',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bits',
            type: 'u64',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'StakeAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: {
              array: ['u8', 10],
            },
          },
          {
            name: 'vaultNonce',
            type: 'u8',
          },
          {
            name: 'bitInUse',
            type: 'u8',
          },
          {
            name: 'stakeState',
            type: {
              defined: 'StakeState',
            },
          },
          {
            name: 'initialStakeAmount',
            type: 'u64',
          },
          {
            name: 'amountStillStaked',
            type: 'u64',
          },
          {
            name: 'amountClaimed',
            type: 'u64',
          },
          {
            name: 'stakeDurationEpochs',
            type: 'u32',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'StakeState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Uninitialized',
          },
          {
            name: 'Vesting',
            fields: [
              {
                name: 'stake_start_epoch',
                type: 'u32',
              },
              {
                name: 'last_claim_ts',
                type: 'u64',
              },
            ],
          },
          {
            name: 'Locked',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'StakeEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'stakeAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'epoch',
          type: 'u32',
          index: false,
        },
        {
          name: 'stakeAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'stakeDurationEpochs',
          type: 'u32',
          index: false,
        },
      ],
    },
    {
      name: 'AddStakeEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'stakeAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'epoch',
          type: 'u32',
          index: false,
        },
        {
          name: 'newStakeAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'addStakeAmount',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'ClaimEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'stakeAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'epoch',
          type: 'u32',
          index: false,
        },
        {
          name: 'newStakeAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'claimAmount',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'ExtendLockupDurationEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'stakeAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'epoch',
          type: 'u32',
          index: false,
        },
        {
          name: 'oldStakeDurationEpochs',
          type: 'u32',
          index: false,
        },
        {
          name: 'newStakeDurationEpochs',
          type: 'u32',
          index: false,
        },
      ],
    },
    {
      name: 'MergeStakeAccountsEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'stakeAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'stakeAccountToMerge',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'epoch',
          type: 'u32',
          index: false,
        },
        {
          name: 'newStakeAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'stakeAmountMerged',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'ToggleStakeAccountEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'stakeAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'epoch',
          type: 'u32',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidAuthority',
      msg: 'Invalid authority',
    },
    {
      code: 6001,
      name: 'InvalidStakeAccountManagerBit',
      msg: 'Stake account manager bit is not free',
    },
    {
      code: 6002,
      name: 'StakeAccountNameTooLong',
      msg: 'Stake account name is too long',
    },
    {
      code: 6003,
      name: 'InvalidToggleWithNoEpochsLeft',
      msg: "Can't toggle a staking account from locked/vesting with no epochs left",
    },
    {
      code: 6004,
      name: 'InvalidExtendLockupDurationEpochs',
      msg: "Can't extend lockup duration beyond max lockup duration",
    },
    {
      code: 6005,
      name: 'InvalidMergeStakeAccountsSameAccount',
      msg: "Can't merge the same stake account",
    },
    {
      code: 6006,
      name: 'InvalidClaimOnLockedAccount',
      msg: "Can't claim on a locked account",
    },
    {
      code: 6007,
      name: 'InvalidStakeZeroTokens',
      msg: "Can't stake zero tokens",
    },
    {
      code: 6008,
      name: 'InvalidStakeDuration',
      msg: 'Invalid number of epochs to stake',
    },
    {
      code: 6009,
      name: 'CanOnlyMergeLockedStakedAccounts',
      msg: 'Can only merge two locked staked accounts',
    },
    {
      code: 6010,
      name: 'StakeAccountToMergeMustHaveShorterRemainingLockup',
      msg: 'Stake account to merge must have shorted remaining lockup than stake account',
    },
    {
      code: 6011,
      name: 'LockedStakeHasNoStakeEnd',
      msg: 'Locked account has no stake_end_epoch',
    },
    {
      code: 6012,
      name: 'InvalidStakeAccountState',
      msg: 'Invalid stake account state',
    },
    {
      code: 6013,
      name: 'HasOutstandingClaim',
      msg: 'Stake account last claim timestamp is not up-to-date',
    },
    {
      code: 6014,
      name: 'ExtendDurationOnLockedOnly',
      msg: "Can't extend lockup duration of vesting account",
    },
    {
      code: 6015,
      name: 'CannotModifyAlreadyUnlockedStakeAccount',
      msg: 'Cannot modify a stake account that is already fully unlocked',
    },
    {
      code: 6016,
      name: 'StakeAccountManagerFull',
      msg: 'Stake account manager full',
    },
  ],
  metadata: {
    address: '4DUapvWZDDCkfWJpdwvX2QjwAE9Yq4wU8792RMMv7Csg',
  },
};
