export const restakingIdl = {
  version: '0.1.0',
  name: 'restaking',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'admin',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenAccount',
          isMut: !0,
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
      ],
      args: [
        {
          name: 'whitelistedTokens',
          type: {
            vec: 'publicKey',
          },
        },
        {
          name: 'stakingCap',
          type: 'u128',
        },
      ],
    },
    {
      name: 'deposit',
      docs: [
        'Stakes the amount in the vault and if guest chain is initialized, a CPI call to the service is being',
        'made to update the stake.',
        '',
        'We are sending the accounts needed for making CPI call to guest blockchain as [`remaining_accounts`]',
        'since we were running out of stack memory. Note that these accounts dont need to be sent until the',
        'guest chain is initialized since CPI calls wont be made during that period.',
        'Since remaining accounts are not named, they have to be',
        'sent in the same order as given below',
        '- Chain Data',
        '- trie',
        '- Guest blockchain program ID',
      ],
      accounts: [
        {
          name: 'depositor',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'vaultParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenMint',
          isMut: !0,
          isSigner: !1,
          docs: [
            'Only token mint with 9 decimals can be staked for now since',
            'the guest chain expects that.  If a whitelisted token has 6',
            'decimals, it would just be invalid.',
          ],
        },
        {
          name: 'depositorTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'vaultTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenMint',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'receiptTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'metadataProgram',
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
        {
          name: 'rent',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'instruction',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'masterEditionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'nftMetadata',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'service',
          type: {
            defined: 'Service',
          },
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'withdrawalRequest',
      docs: [
        'Creates a withdrawal request by escrowing the receipt token. Once the unbonding',
        'period ends, the token from the escrow would be burnt and returned to the user.',
        '',
        'This method transfers all the pending rewards to the user. The stake on the',
        'guest chain is only updated after unbonding period ends in `withdraw` method.',
        '',
        'Closes the receipt token account.',
      ],
      accounts: [
        {
          name: 'withdrawer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'vaultParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'guestChain',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'trie',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'withdrawerTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'vaultTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'depositorRewardsTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'platformRewardsTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'escrowReceiptTokenAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'Account which stores the receipt token until unbonding period ends.',
          ],
        },
        {
          name: 'guestChainProgram',
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
        {
          name: 'metadataProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rent',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'masterEditionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'nftMetadata',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'instruction',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'cancelWithdrawalRequest',
      docs: [
        'Cancels the withdraw request and returns the receipt NFT.',
        '',
        'Even if the unbonding period is over and the withdraw is pending,',
        'this method would cancel the withdrawal request and return back the',
        'receipt NFT',
      ],
      accounts: [
        {
          name: 'withdrawer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'vaultParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'escrowReceiptTokenAccount',
          isMut: !0,
          isSigner: !1,
          docs: [
            'Account which stores the receipt token until unbonding period ends.',
          ],
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
        {
          name: 'metadataProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rent',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'masterEditionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'nftMetadata',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'withdraw',
      docs: [
        'Withdraws the staked token and burns the receipt NFT once the',
        'unbonding period has ended.',
        '',
        'This method should only be called once the `WithdrawalRequest` method',
        'is called and unbonding period is over.',
        '',
        'This method can be called by anybody and if the unbonding period is',
        'over, then the tokens would be withdrawn to the account set during',
        'withdrawal request. This is done so that we can enable automatic withdrawal',
        'after unbonding period. The amount is withdrawn to the account set during',
        'the request and the `vault_params` and `escrow_receipt_token_account` are',
        'closed.',
      ],
      accounts: [
        {
          name: 'signer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'withdrawer',
          isMut: !0,
          isSigner: !1,
          docs: ['Account which requested withdrawal', ''],
        },
        {
          name: 'vaultParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'guestChain',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'trie',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'tokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'withdrawerTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'vaultTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'escrowReceiptTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'guestChainProgram',
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
          name: 'metadataProgram',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rent',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'masterEditionAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'nftMetadata',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'instruction',
          isMut: !1,
          isSigner: !1,
        },
      ],
      args: [],
    },
    {
      name: 'updateTokenWhitelist',
      docs: [
        'Whitelists new tokens',
        '',
        'This method checks if any of the new token mints which are to be whitelisted',
        'are already whitelisted. If they are the method fails to update the',
        'whitelisted token list.',
      ],
      accounts: [
        {
          name: 'admin',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'newTokenMints',
          type: {
            vec: 'publicKey',
          },
        },
      ],
    },
    {
      name: 'updateGuestChainInitialization',
      docs: [
        'Sets guest chain program ID',
        '',
        'After this method is called, CPI calls would be made to guest chain during deposit and stake would be',
        'set to the validators. Users can also claim rewards or withdraw their stake',
        'when the chain is initialized.',
      ],
      accounts: [
        {
          name: 'admin',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'guestChainProgramId',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'changeAdminProposal',
      docs: [
        'Updating admin proposal created by the existing admin. Admin would only be changed',
        'if the new admin accepts it in `accept_admin_change` instruction.',
      ],
      accounts: [
        {
          name: 'admin',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakingParams',
          isMut: !0,
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
      name: 'acceptAdminChange',
      docs: [
        'Accepting new admin change signed by the proposed admin. Admin would be changed if the',
        'proposed admin calls the method. Would fail if there is no proposed admin and if the',
        'signer is not the proposed admin.',
      ],
      accounts: [
        {
          name: 'newAdmin',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
          docs: ['Validation would be done in the method'],
        },
      ],
      args: [],
    },
    {
      name: 'claimRewards',
      accounts: [
        {
          name: 'claimer',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'vaultParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'guestChain',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'depositorRewardsTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'platformRewardsTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'guestChainProgram',
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
      args: [],
    },
    {
      name: 'setService',
      docs: [
        'This method sets the service for the stake which was deposited before guest chain',
        'initialization',
        '',
        'This method can only be called if the service was not set during the depositing and',
        'can only be called once. Calling otherwise would panic.',
        '',
        'The accounts for CPI are sent as remaining accounts similar to `deposit` method.',
      ],
      accounts: [
        {
          name: 'depositor',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'vaultParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'receiptTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'stakeMint',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'instruction',
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
          name: 'service',
          type: {
            defined: 'Service',
          },
        },
      ],
    },
    {
      name: 'withdrawRewardFunds',
      docs: [
        'This method would only be called by `Admin` to withdraw all the funds from the rewards account',
        '',
        'This would usually be called when a wrong amount of funds are transferred in the rewards account.',
        'This is a safety measure and should only be called on emergency.',
      ],
      accounts: [
        {
          name: 'admin',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenMint',
          isMut: !1,
          isSigner: !1,
        },
        {
          name: 'rewardsTokenAccount',
          isMut: !0,
          isSigner: !1,
        },
        {
          name: 'adminRewardsTokenAccount',
          isMut: !1,
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
    {
      name: 'updateStakingCap',
      accounts: [
        {
          name: 'admin',
          isMut: !0,
          isSigner: !0,
        },
        {
          name: 'stakingParams',
          isMut: !0,
          isSigner: !1,
        },
      ],
      args: [
        {
          name: 'newStakingCap',
          type: 'u128',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'stakingParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admin',
            type: 'publicKey',
          },
          {
            name: 'whitelistedTokens',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'guestChainProgramId',
            docs: ['None means the guest chain is not initialized yet.'],
            type: {
              option: 'publicKey',
            },
          },
          {
            name: 'rewardsTokenMint',
            type: 'publicKey',
          },
          {
            name: 'stakingCap',
            type: 'u128',
          },
          {
            name: 'totalDepositedAmount',
            type: 'u128',
          },
          {
            name: 'newAdminProposal',
            type: {
              option: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'vault',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'stakeTimestampSec',
            type: 'i64',
          },
          {
            name: 'service',
            type: {
              option: {
                defined: 'Service',
              },
            },
          },
          {
            name: 'stakeAmount',
            type: 'u64',
          },
          {
            name: 'stakeMint',
            type: 'publicKey',
          },
          {
            name: 'lastReceivedRewardsHeight',
            docs: ['is 0 initially'],
            type: 'u64',
          },
          {
            name: 'withdrawalRequest',
            type: {
              option: {
                defined: 'WithdrawalRequestParams',
              },
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'WithdrawalRequestParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'timestampInSec',
            docs: ['Timestamp when withdrawal was requested'],
            type: 'u64',
          },
          {
            name: 'owner',
            docs: ['Account which requested the withdrawal'],
            type: 'publicKey',
          },
          {
            name: 'tokenAccount',
            docs: ['Token account to which the tokens would withdrew to'],
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'Service',
      docs: ['Unused for now'],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'GuestChain',
            fields: [
              {
                name: 'validator',
                type: 'publicKey',
              },
            ],
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6e3,
      name: 'TokenAlreadyWhitelisted',
      msg: 'Token is already whitelisted',
    },
    {
      code: 6001,
      name: 'TokenNotWhitelisted',
      msg: 'Can only stake whitelisted tokens',
    },
    {
      code: 6002,
      name: 'OperationNotAllowed',
      msg: 'This operation is not allowed until the guest chain is initialized',
    },
    {
      code: 6003,
      name: 'SubtractionOverflow',
      msg: 'Subtraction overflow',
    },
    {
      code: 6004,
      name: 'InvalidTokenMint',
      msg: 'Invalid Token Mint',
    },
    {
      code: 6005,
      name: 'InsufficientReceiptTokenBalance',
      msg: 'Insufficient receipt token balance, expected balance 1',
    },
    {
      code: 6006,
      name: 'MissingService',
      msg: 'Service is missing. Make sure you have assigned your stake to a \\\n         service',
    },
    {
      code: 6007,
      name: 'StakingCapExceeded',
      msg: 'Staking cap has reached. You can stake only when the staking cap is \\\n         increased',
    },
    {
      code: 6008,
      name: 'NewStakingCapShouldBeMoreThanExistingOne',
      msg: 'New staking cap should be more than existing one',
    },
    {
      code: 6009,
      name: 'GuestChainAlreadyInitialized',
      msg: 'Guest chain can only be initialized once',
    },
    {
      code: 6010,
      name: 'AccountValidationFailedForCPI',
      msg: 'Account validation for CPI call to the guest chain',
    },
    {
      code: 6011,
      name: 'ServiceAlreadySet',
      msg: 'Service is already set.',
    },
    {
      code: 6012,
      name: 'NoProposedAdmin',
      msg: 'There is no proposal for changing admin',
    },
    {
      code: 6013,
      name: 'CannotWithdrawDuringUnbondingPeriod',
      msg: 'Cannot withdraw during unbonding period.',
    },
    {
      code: 6014,
      name: 'NoWithdrawalRequest',
      msg: 'No withdrawal request exists. Try to request for withdraw and you \\\n         can withdraw after unbonding period ends',
    },
    {
      code: 6015,
      name: 'InvalidTokenAccount',
      msg: 'Invalid token account',
    },
    {
      code: 6016,
      name: 'InvalidWithdrawer',
      msg: 'When the account which requested for withdraw is not passed during \\\n         withdrawal',
    },
  ],
};
