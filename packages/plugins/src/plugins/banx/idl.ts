export const BanxIDL = {
  version: '0.1.0',
  name: 'bonds',
  accounts: [
    {
      name: 'banxAdventureSubscription',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'adventureSubscriptionState',
            type: {
              defined: 'BanxAdventureSubscriptionState',
            },
          },
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'adventure',
            type: 'publicKey',
          },
          {
            name: 'banxTokenStake',
            type: 'publicKey',
          },
          {
            name: 'stakeTokensAmount',
            type: 'u64',
          },
          {
            name: 'stakeNftAmount',
            type: 'u64',
          },
          {
            name: 'stakePartnerPointsAmount',
            type: 'u64',
          },
          {
            name: 'stakePlayerPointsAmount',
            type: 'u64',
          },
          {
            name: 'subscribedAt',
            type: 'u64',
          },
          {
            name: 'unsubscribedAt',
            type: 'u64',
          },
          {
            name: 'harvestedAt',
            type: 'u64',
          },
          {
            name: 'amountOfTokensHarvested',
            type: 'u64',
          },
          {
            name: 'amountOfHadesTokensHarvested',
            type: 'u64',
          },
          {
            name: 'placeholderTwo',
            type: 'u64',
          },
          {
            name: 'placeholderThree',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'banxAdventure',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'adventureState',
            type: {
              defined: 'BanxAdventureState',
            },
          },
          {
            name: 'tokensPerPoints',
            type: 'u64',
          },
          {
            name: 'week',
            type: 'u64',
          },
          {
            name: 'periodStartedAt',
            type: 'u64',
          },
          {
            name: 'periodEndingAt',
            type: 'u64',
          },
          {
            name: 'rewardsToBeDistributed',
            type: 'u64',
          },
          {
            name: 'totalPartnerPoints',
            type: 'u64',
          },
          {
            name: 'totalPlayerPoints',
            type: 'u64',
          },
          {
            name: 'totalTokensStaked',
            type: 'u64',
          },
          {
            name: 'totalBanxSubscribed',
            type: 'u64',
          },
          {
            name: 'amountOfTokensHarvested',
            type: 'u64',
          },
          {
            name: 'placeholderOne',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'banxStakingSettings',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'banxStakingSettingsState',
            type: {
              defined: 'BanxStakingSettingsState',
            },
          },
          {
            name: 'maxTokenStakeAmount',
            type: 'u64',
          },
          {
            name: 'tokensPerPartnerPoints',
            type: 'u64',
          },
          {
            name: 'tokensStaked',
            type: 'u64',
          },
          {
            name: 'banxStaked',
            type: 'u64',
          },
          {
            name: 'tokensPerWeek',
            type: 'u64',
          },
          {
            name: 'rewardsHarvested',
            type: 'u64',
          },
          {
            name: 'hadesPerWeek',
            type: 'u64',
          },
          {
            name: 'placeholderTwo',
            type: 'u64',
          },
          {
            name: 'placeholderThree',
            type: 'u64',
          },
          {
            name: 'placeholderFour',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'banxTokenStake',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'banxStakeState',
            type: {
              defined: 'BanxTokenStakeState',
            },
          },
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'adventureSubscriptionsQuantity',
            type: 'u64',
          },
          {
            name: 'tokensStaked',
            type: 'u64',
          },
          {
            name: 'partnerPointsStaked',
            type: 'u64',
          },
          {
            name: 'playerPointsStaked',
            type: 'u64',
          },
          {
            name: 'banxNftsStakedQuantity',
            type: 'u64',
          },
          {
            name: 'stakedAt',
            type: 'u64',
          },
          {
            name: 'unstakedAt',
            type: 'u64',
          },
          {
            name: 'farmedAmount',
            type: 'u64',
          },
          {
            name: 'nftsStakedAt',
            type: 'u64',
          },
          {
            name: 'nftsUnstakedAt',
            type: 'u64',
          },
          {
            name: 'placeholderOne',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'collateralBox',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'fbond',
            type: 'publicKey',
          },
          {
            name: 'collateralBoxType',
            type: {
              defined: 'CollateralBoxType',
            },
          },
          {
            name: 'collateralTokenMint',
            type: 'publicKey',
          },
          {
            name: 'collateralTokenAccount',
            type: 'publicKey',
          },
          {
            name: 'collateralAmount',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'fraktBond',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'fraktBondState',
            type: {
              defined: 'FraktBondState',
            },
          },
          {
            name: 'bondTradeTransactionsCounter',
            type: 'u8',
          },
          {
            name: 'borrowedAmount',
            type: 'u64',
          },
          {
            name: 'banxStake',
            type: 'publicKey',
          },
          {
            name: 'fraktMarket',
            type: 'publicKey',
          },
          {
            name: 'amountToReturn',
            type: 'u64',
          },
          {
            name: 'actualReturnedAmount',
            type: 'u64',
          },
          {
            name: 'terminatedCounter',
            type: 'u8',
          },
          {
            name: 'fbondTokenMint',
            type: 'publicKey',
          },
          {
            name: 'fbondTokenSupply',
            type: 'u64',
          },
          {
            name: 'activatedAt',
            type: 'u64',
          },
          {
            name: 'liquidatingAt',
            type: 'u64',
          },
          {
            name: 'fbondIssuer',
            type: 'publicKey',
          },
          {
            name: 'repaidOrLiquidatedAt',
            type: 'u64',
          },
          {
            name: 'currentPerpetualBorrowed',
            type: 'u64',
          },
          {
            name: 'lastTransactedAt',
            type: 'u64',
          },
          {
            name: 'refinanceAuctionStartedAt',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'flashLoanPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'borrowing',
            type: 'bool',
          },
          {
            name: 'balance',
            type: 'u64',
          },
          {
            name: 'loanFeePoints',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'proposal',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'state',
            type: {
              defined: 'ProposalState',
            },
          },
          {
            name: 'name',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'week',
            type: 'u64',
          },
          {
            name: 'duration',
            type: 'u64',
          },
          {
            name: 'pointsQuorum',
            type: 'u64',
          },
          {
            name: 'creator',
            type: 'publicKey',
          },
          {
            name: 'participants',
            type: 'u64',
          },
          {
            name: 'pointsTotal',
            type: 'u64',
          },
          {
            name: 'initializedAt',
            type: 'u64',
          },
          {
            name: 'lastTransactedAt',
            type: 'u64',
          },
          {
            name: 'placeholder1',
            type: 'u64',
          },
          {
            name: 'placeholder2',
            type: 'u64',
          },
          {
            name: 'placeholder3',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'proposalVariant',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'proposal',
            type: 'publicKey',
          },
          {
            name: 'name',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'state',
            type: {
              defined: 'ProposalState',
            },
          },
          {
            name: 'participants',
            type: 'u64',
          },
          {
            name: 'pointsTotal',
            type: 'u64',
          },
          {
            name: 'lastTransactedAt',
            type: 'u64',
          },
          {
            name: 'placeholder1',
            type: 'u64',
          },
          {
            name: 'placeholder2',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'proposalVote',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'state',
            type: {
              defined: 'ProposalState',
            },
          },
          {
            name: 'proposalVariant',
            type: 'publicKey',
          },
          {
            name: 'adventureSubscription',
            type: 'publicKey',
          },
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'points',
            type: 'u64',
          },
          {
            name: 'lastTransactedAt',
            type: 'u64',
          },
          {
            name: 'placeholder',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'hadoMarketRegistry',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'hadoMarket',
            type: 'publicKey',
          },
          {
            name: 'fraktMarket',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'hadoMarketValidation',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'hadoMarket',
            type: 'publicKey',
          },
          {
            name: 'creatorHash',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'placeholderOne',
            type: 'publicKey',
          },
          {
            name: 'placeholderTwo',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'hadoMarket',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'marketAuthority',
            type: 'publicKey',
          },
          {
            name: 'marketState',
            type: {
              defined: 'MarketState',
            },
          },
          {
            name: 'marketTrustType',
            type: {
              defined: 'MarketTrustType',
            },
          },
          {
            name: 'pairValidationType',
            type: {
              defined: 'PairValidationType',
            },
          },
          {
            name: 'fraktMarket',
            type: 'publicKey',
          },
          {
            name: 'minBidCap',
            type: 'u64',
          },
          {
            name: 'minMarketFee',
            type: 'u64',
          },
          {
            name: 'whitelistType',
            type: {
              defined: 'NftValidationWhitelistTypeHado',
            },
          },
          {
            name: 'whitelistedAddress',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'bondOfferV2',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'hadoMarket',
            type: 'publicKey',
          },
          {
            name: 'pairState',
            type: {
              defined: 'PairState',
            },
          },
          {
            name: 'bondingCurve',
            type: {
              defined: 'BondOfferBondingCurve',
            },
          },
          {
            name: 'baseSpotPrice',
            type: 'u64',
          },
          {
            name: 'mathCounter',
            type: 'i64',
          },
          {
            name: 'currentSpotPrice',
            type: 'u64',
          },
          {
            name: 'concentrationIndex',
            type: 'u64',
          },
          {
            name: 'bidCap',
            type: 'u64',
          },
          {
            name: 'bidSettlement',
            type: 'i64',
          },
          {
            name: 'edgeSettlement',
            type: 'u64',
          },
          {
            name: 'fundsSolOrTokenBalance',
            type: 'u64',
          },
          {
            name: 'buyOrdersQuantity',
            type: 'u64',
          },
          {
            name: 'lastTransactedAt',
            type: 'u64',
          },
          {
            name: 'assetReceiver',
            type: 'publicKey',
          },
          {
            name: 'validation',
            type: {
              defined: 'BondOfferValidation',
            },
          },
        ],
      },
    },
    {
      name: 'bondOfferV3',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'hadoMarket',
            type: 'publicKey',
          },
          {
            name: 'pairState',
            type: {
              defined: 'PairState',
            },
          },
          {
            name: 'bondingCurve',
            type: {
              defined: 'BondOfferBondingCurve',
            },
          },
          {
            name: 'baseSpotPrice',
            type: 'u64',
          },
          {
            name: 'mathCounter',
            type: 'i64',
          },
          {
            name: 'currentSpotPrice',
            type: 'u64',
          },
          {
            name: 'concentrationIndex',
            type: 'u64',
          },
          {
            name: 'bidCap',
            type: 'u64',
          },
          {
            name: 'bidSettlement',
            type: 'i64',
          },
          {
            name: 'edgeSettlement',
            type: 'u64',
          },
          {
            name: 'fundsSolOrTokenBalance',
            type: 'u64',
          },
          {
            name: 'buyOrdersQuantity',
            type: 'u64',
          },
          {
            name: 'lastTransactedAt',
            type: 'u64',
          },
          {
            name: 'assetReceiver',
            type: 'publicKey',
          },
          {
            name: 'validation',
            type: {
              defined: 'BondOfferValidation',
            },
          },
          {
            name: 'fundsInCurrentEpoch',
            type: 'u64',
          },
          {
            name: 'fundsInNextEpoch',
            type: 'u64',
          },
          {
            name: 'lastCalculatedSlot',
            type: 'u64',
          },
          {
            name: 'lastCalculatedTimestamp',
            type: 'u64',
          },
          {
            name: 'rewardsToHarvest',
            type: 'u64',
          },
          {
            name: 'rewardsToHarvested',
            type: 'u64',
          },
          {
            name: 'placeholderOne',
            type: 'u64',
          },
          {
            name: 'placeholderTwo',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'bondTradeTransactionV2',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bondTradeTransactionState',
            type: {
              defined: 'BondTradeTransactionV2State',
            },
          },
          {
            name: 'bondOffer',
            type: 'publicKey',
          },
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'amountOfBonds',
            type: 'u64',
          },
          {
            name: 'solAmount',
            type: 'u64',
          },
          {
            name: 'feeAmount',
            type: 'u64',
          },
          {
            name: 'bondTradeTransactionType',
            type: {
              defined: 'BondTradeTransactionV2Type',
            },
          },
          {
            name: 'fbondTokenMint',
            type: 'publicKey',
          },
          {
            name: 'soldAt',
            type: 'u64',
          },
          {
            name: 'redeemedAt',
            type: 'u64',
          },
          {
            name: 'redeemResult',
            type: {
              defined: 'RedeemResult',
            },
          },
          {
            name: 'seller',
            type: 'publicKey',
          },
          {
            name: 'isDirectSell',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'bondTradeTransactionV3',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bondTradeTransactionState',
            type: {
              defined: 'BondTradeTransactionV2State',
            },
          },
          {
            name: 'bondOffer',
            type: 'publicKey',
          },
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'amountOfBonds',
            type: 'u64',
          },
          {
            name: 'solAmount',
            type: 'u64',
          },
          {
            name: 'feeAmount',
            type: 'u64',
          },
          {
            name: 'bondTradeTransactionType',
            type: {
              defined: 'BondTradeTransactionV2Type',
            },
          },
          {
            name: 'fbondTokenMint',
            type: 'publicKey',
          },
          {
            name: 'soldAt',
            type: 'u64',
          },
          {
            name: 'redeemedAt',
            type: 'u64',
          },
          {
            name: 'redeemResult',
            type: {
              defined: 'RedeemResult',
            },
          },
          {
            name: 'seller',
            type: 'publicKey',
          },
          {
            name: 'isDirectSell',
            type: 'bool',
          },
          {
            name: 'lendingToken',
            type: {
              defined: 'LendingTokenType',
            },
          },
          {
            name: 'currentRemainingLent',
            type: 'u64',
          },
          {
            name: 'interestSnapshot',
            type: 'u64',
          },
          {
            name: 'partialRepaySnapshot',
            type: 'u64',
          },
          {
            name: 'terminationStartedAt',
            type: 'u64',
          },
          {
            name: 'lenderOriginalLent',
            type: 'u64',
          },
          {
            name: 'lenderFullRepaidAmount',
            type: 'u64',
          },
          {
            name: 'borrowerOriginalLent',
            type: 'u64',
          },
          {
            name: 'borrowerFullRepaidAmount',
            type: 'u64',
          },
          {
            name: 'repayDestination',
            type: {
              defined: 'RepayDestination',
            },
          },
          {
            name: 'repaymentCallAmount',
            type: 'u64',
          },
          {
            name: 'terminationFreeze',
            type: 'u64',
          },
          {
            name: 'placeholder3',
            type: 'u64',
          },
          {
            name: 'placeholder4',
            type: 'u64',
          },
          {
            name: 'placeholder5',
            type: 'u64',
          },
          {
            name: 'placeholder6',
            type: 'u64',
          },
          {
            name: 'placeholder7',
            type: 'u64',
          },
          {
            name: 'placeholder8',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'repaymentCall',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'callState',
            type: {
              defined: 'CallState',
            },
          },
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'bond',
            type: 'publicKey',
          },
          {
            name: 'bondTradeTransaction',
            type: 'publicKey',
          },
          {
            name: 'callAmount',
            type: 'u64',
          },
          {
            name: 'lastUpdatedAt',
            type: 'u64',
          },
          {
            name: 'lastCallAt',
            type: 'u64',
          },
          {
            name: 'lastRepaidAt',
            type: 'u64',
          },
          {
            name: 'placeholderOne',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'adventureSubscription',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'stake',
            type: 'publicKey',
          },
          {
            name: 'adventure',
            type: 'publicKey',
          },
          {
            name: 'subscribedAt',
            type: 'u64',
          },
          {
            name: 'unsubscribedAt',
            type: 'u64',
          },
          {
            name: 'harvestedAt',
            type: 'u64',
          },
          {
            name: 'amountOfSolHarvested',
            type: 'u64',
          },
          {
            name: 'placeholderOne',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'adventure',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'adventureState',
            type: {
              defined: 'AdventureState',
            },
          },
          {
            name: 'periodStartedAt',
            type: 'u64',
          },
          {
            name: 'periodEndingAt',
            type: 'u64',
          },
          {
            name: 'rewardsUpperLimit',
            type: 'u64',
          },
          {
            name: 'rewardsLowerLimit',
            type: 'u64',
          },
          {
            name: 'totalPeriodRevenue',
            type: 'u64',
          },
          {
            name: 'rewardsToBeDistributed',
            type: 'u64',
          },
          {
            name: 'totalBanxSubscribed',
            type: 'u64',
          },
          {
            name: 'totalPartnerPoints',
            type: 'u64',
          },
          {
            name: 'totalPlayerPoints',
            type: 'u64',
          },
          {
            name: 'banxSubscribedLeft',
            type: 'u64',
          },
          {
            name: 'partnerPointsLeft',
            type: 'u64',
          },
          {
            name: 'playerPointsLeft',
            type: 'u64',
          },
          {
            name: 'rewardsLeft',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'banxPointsMap',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'banxMint',
            type: 'publicKey',
          },
          {
            name: 'playerPoints',
            type: 'u64',
          },
          {
            name: 'partnerPoints',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'banxStake',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'banxStakeState',
            type: {
              defined: 'BanxStakeState',
            },
          },
          {
            name: 'adventureSubscriptionsQuantity',
            type: 'u64',
          },
          {
            name: 'nftMint',
            type: 'publicKey',
          },
          {
            name: 'collateralTokenAccount',
            type: 'publicKey',
          },
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'stakedAt',
            type: 'u64',
          },
          {
            name: 'unstakedOrLiquidatedAt',
            type: 'u64',
          },
          {
            name: 'isLoaned',
            type: 'bool',
          },
          {
            name: 'bond',
            type: 'publicKey',
          },
          {
            name: 'playerPoints',
            type: 'u64',
          },
          {
            name: 'partnerPoints',
            type: 'u64',
          },
          {
            name: 'farmedAmount',
            type: 'u64',
          },
          {
            name: 'placeholderOne',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'banxUser',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'stakedPlayerPoints',
            type: 'u64',
          },
          {
            name: 'stakedPartnerPoints',
            type: 'u64',
          },
          {
            name: 'stakedBanx',
            type: 'u64',
          },
          {
            name: 'totalHarvestedRewards',
            type: 'u64',
          },
          {
            name: 'freeLiquidityCurrent',
            type: 'u64',
          },
          {
            name: 'placeholderOne',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'stakingSettings',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'mainVaultBalance',
            type: 'u64',
          },
          {
            name: 'upperRewardsLimit',
            type: 'u64',
          },
          {
            name: 'lowerRewardsLimit',
            type: 'u64',
          },
          {
            name: 'placeholderOne',
            type: 'publicKey',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'SaveProposalParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'week',
            type: 'u64',
          },
          {
            name: 'duration',
            type: 'u64',
          },
          {
            name: 'pointsQuorum',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'SaveVariantParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: {
              array: ['u8', 32],
            },
          },
        ],
      },
    },
    {
      name: 'InitializeHadoMarketParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'minBidCap',
            type: 'u64',
          },
          {
            name: 'minMarketFee',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'BorrowPerpetualParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'minAmountToGet',
            type: 'u64',
          },
          {
            name: 'amountOfSolToGet',
            type: 'u64',
          },
          {
            name: 'bondTradeTransactionBump',
            type: 'u8',
          },
          {
            name: 'fraktBondBump',
            type: 'u8',
          },
          {
            name: 'bondOfferVaultBump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'MakePerpetualMarketParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'minBidCap',
            type: 'u64',
          },
          {
            name: 'minMarketFee',
            type: 'u64',
          },
          {
            name: 'marketState',
            type: {
              defined: 'MarketState',
            },
          },
        ],
      },
    },
    {
      name: 'SubscribeBanxAdventureParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'week',
            type: 'u64',
          },
          {
            name: 'adventureBump',
            type: 'u8',
          },
          {
            name: 'subscriptionBump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'BondOfferValidation',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'loanToValueFilter',
            type: 'u64',
          },
          {
            name: 'collateralsPerToken',
            type: 'u64',
          },
          {
            name: 'maxReturnAmountFilter',
            type: 'u64',
          },
          {
            name: 'bondFeatures',
            type: {
              defined: 'BondFeatures',
            },
          },
        ],
      },
    },
    {
      name: 'BondOfferBondingCurve',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'delta',
            type: 'u64',
          },
          {
            name: 'bondingType',
            type: {
              defined: 'BondOfferBondingCurveType',
            },
          },
        ],
      },
    },
    {
      name: 'AuthorizationDataLocal',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'payload',
            type: {
              vec: {
                defined: 'TaggedPayload',
              },
            },
          },
        ],
      },
    },
    {
      name: 'TaggedPayload',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'payload',
            type: {
              defined: 'PayloadTypeLocal',
            },
          },
        ],
      },
    },
    {
      name: 'SeedsVecLocal',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'seeds',
            docs: ['The vector of derivation seeds.'],
            type: {
              vec: 'bytes',
            },
          },
        ],
      },
    },
    {
      name: 'ProofInfoLocal',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'proof',
            docs: ['The merkle proof.'],
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
      name: 'ProposalErrorCode',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'InvalidWeek',
          },
          {
            name: 'InvalidPreviousVariant',
          },
          {
            name: 'ProposalIsNotActive',
          },
        ],
      },
    },
    {
      name: 'BanxAdventureSubscriptionState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Active',
          },
          {
            name: 'Claimed',
          },
        ],
      },
    },
    {
      name: 'BanxAdventureState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Active',
          },
        ],
      },
    },
    {
      name: 'BanxStakingSettingsState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Active',
          },
        ],
      },
    },
    {
      name: 'BanxTokenStakeState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Staked',
          },
          {
            name: 'Unstaked',
          },
        ],
      },
    },
    {
      name: 'CollateralBoxType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Escrow',
          },
          {
            name: 'Escrowless',
          },
        ],
      },
    },
    {
      name: 'FraktBondState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Initialized',
          },
          {
            name: 'Active',
          },
          {
            name: 'Repaid',
          },
          {
            name: 'Liquidating',
          },
          {
            name: 'Liquidated',
          },
          {
            name: 'PerpetualActive',
          },
          {
            name: 'PerpetualRepaid',
          },
          {
            name: 'PerpetualLiquidatedByAuction',
          },
          {
            name: 'PerpetualLiquidatedByClaim',
          },
        ],
      },
    },
    {
      name: 'ProposalState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Initialized',
          },
        ],
      },
    },
    {
      name: 'NftValidationWhitelistTypeHado',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Creator',
          },
          {
            name: 'Nft',
          },
          {
            name: 'MerkleTree',
          },
          {
            name: 'CollectionId',
          },
          {
            name: 'SplMint',
          },
        ],
      },
    },
    {
      name: 'MarketTrustType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Unverified',
          },
          {
            name: 'Verified',
          },
        ],
      },
    },
    {
      name: 'MarketState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Initializing',
          },
          {
            name: 'Available',
          },
          {
            name: 'InitializingPerpetual',
          },
          {
            name: 'AvailablePerpetual',
          },
          {
            name: 'PrivateAvailablePerpetual',
          },
        ],
      },
    },
    {
      name: 'PairValidationType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'ClassicValidation',
          },
          {
            name: 'CustomValidation',
          },
        ],
      },
    },
    {
      name: 'PairTokenType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'NativeSol',
          },
          {
            name: 'Spl',
          },
        ],
      },
    },
    {
      name: 'BondFeatures',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Autocompound',
          },
          {
            name: 'ReceiveNftOnLiquidation',
          },
          {
            name: 'AutoreceiveSol',
          },
          {
            name: 'AutoCompoundAndReceiveNft',
          },
          {
            name: 'AutoReceiveAndReceiveNft',
          },
          {
            name: 'AutoReceiveAndReceiveSpl',
          },
        ],
      },
    },
    {
      name: 'PairState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Initializing',
          },
          {
            name: 'OnMarketVirtual',
          },
          {
            name: 'OnMarketTokenized',
          },
          {
            name: 'Frozen',
          },
          {
            name: 'Closed',
          },
          {
            name: 'PerpetualOnMarket',
          },
          {
            name: 'PerpetualClosed',
          },
          {
            name: 'PerpetualBondingCurveOnMarket',
          },
          {
            name: 'PerpetualMigrated',
          },
          {
            name: 'PerpetualBondingCurveClosed',
          },
          {
            name: 'PerpetualListing',
          },
        ],
      },
    },
    {
      name: 'BondOfferBondingCurveType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Linear',
          },
          {
            name: 'Exponential',
          },
          {
            name: 'LinearUsdc',
          },
          {
            name: 'ExponentialUsdc',
          },
          {
            name: 'LinearBanxSol',
          },
          {
            name: 'ExponentialBanxSol',
          },
        ],
      },
    },
    {
      name: 'BondTradeTransactionV2State',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'NotActive',
          },
          {
            name: 'Active',
          },
          {
            name: 'PerpetualActive',
          },
          {
            name: 'PerpetualRepaid',
          },
          {
            name: 'PerpetualLiquidatedByAuction',
          },
          {
            name: 'PerpetualLiquidatedByClaim',
          },
          {
            name: 'PerpetualManualTerminating',
          },
          {
            name: 'PerpetualPartialRepaid',
          },
          {
            name: 'PerpetualRefinanceRepaid',
          },
          {
            name: 'PerpetualRefinancedActive',
          },
          {
            name: 'Migrated',
          },
          {
            name: 'PerpetualBorrowerListing',
          },
          {
            name: 'PerpetualLenderListing',
          },
        ],
      },
    },
    {
      name: 'BondTradeTransactionV2Type',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Autocompound',
          },
          {
            name: 'ReceiveNftOnLiquidation',
          },
          {
            name: 'AutoreceiveSol',
          },
          {
            name: 'AutoCompoundAndReceiveNft',
          },
          {
            name: 'AutoReceiveAndReceiveNft',
          },
          {
            name: 'AutoReceiveAndReceiveSpl',
          },
        ],
      },
    },
    {
      name: 'RedeemResult',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'DirectBorrow',
          },
          {
            name: 'Reborrow',
          },
          {
            name: 'InstantRefinanced',
          },
          {
            name: 'RefinancedByAuction',
          },
          {
            name: 'PartialRepay',
          },
          {
            name: 'DirectRepaid',
          },
          {
            name: 'Claimed',
          },
          {
            name: 'DirectBorrowAndDirectRepaid',
          },
          {
            name: 'DirectBorrowAndReborrowRepaid',
          },
          {
            name: 'DirectBorrowAndInstantRefinancedRepaid',
          },
          {
            name: 'DirectBorrowAndRefinancedByAuctionRepaid',
          },
          {
            name: 'DirectBorrowAndPartialRepaid',
          },
          {
            name: 'DirectBorrowAndClaimed',
          },
          {
            name: 'ReborrowAndDirectRepaid',
          },
          {
            name: 'ReborrowAndReborrowRepaid',
          },
          {
            name: 'ReborrowAndInstantRefinancedRepaid',
          },
          {
            name: 'ReborrowAndRefinancedByAuctionRepaid',
          },
          {
            name: 'ReborrowAndPartialRepaid',
          },
          {
            name: 'ReborrowAndClaimed',
          },
          {
            name: 'InstantRefinancedAndDirectRepaid',
          },
          {
            name: 'InstantRefinancedAndReborrowRepaid',
          },
          {
            name: 'InstantRefinancedAndInstantRefinancedRepaid',
          },
          {
            name: 'InstantRefinancedAndRefinancedByAuctionRepaid',
          },
          {
            name: 'InstantRefinancedAndPartialRepaid',
          },
          {
            name: 'InstantRefinancedAndClaimed',
          },
          {
            name: 'RefinancedByAuctionAndDirectRepaid',
          },
          {
            name: 'RefinancedByAuctionAndReborrowRepaid',
          },
          {
            name: 'RefinancedByAuctionAndInstantRefinancedRepaid',
          },
          {
            name: 'RefinancedByAuctionAndRefinancedByAuctionRepaid',
          },
          {
            name: 'RefinancedByAuctionAndPartialRepaid',
          },
          {
            name: 'RefinancedByAuctionAndClaimed',
          },
          {
            name: 'PartialRepaidAndDirectRepaid',
          },
          {
            name: 'PartialRepaidAndReborrowRepaid',
          },
          {
            name: 'PartialRepaidAndInstantRefinancedRepaid',
          },
          {
            name: 'PartialRepaidAndRefinancedByAuctionRepaid',
          },
          {
            name: 'PartialRepaidAndPartialRepaid',
          },
          {
            name: 'PartialRepaidAndClaimed',
          },
        ],
      },
    },
    {
      name: 'LendingTokenType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'NativeSol',
          },
          {
            name: 'Usdc',
          },
          {
            name: 'BanxSol',
          },
        ],
      },
    },
    {
      name: 'RepayDestination',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'None',
          },
          {
            name: 'Offer',
          },
          {
            name: 'Wallet',
          },
          {
            name: 'Vault',
          },
        ],
      },
    },
    {
      name: 'CallState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Uninitialized',
          },
          {
            name: 'Initialized',
          },
        ],
      },
    },
    {
      name: 'AdventureState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Uninitialized',
          },
          {
            name: 'Initialized',
          },
          {
            name: 'DistributingInitialized',
          },
        ],
      },
    },
    {
      name: 'BanxStakeState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Staked',
          },
          {
            name: 'Unstaked',
          },
          {
            name: 'Liquidated',
          },
        ],
      },
    },
    {
      name: 'PayloadTypeLocal',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Pubkey',
            fields: ['publicKey'],
          },
          {
            name: 'Seeds',
            fields: [
              {
                defined: 'SeedsVecLocal',
              },
            ],
          },
          {
            name: 'MerkleProof',
            fields: [
              {
                defined: 'ProofInfoLocal',
              },
            ],
          },
          {
            name: 'Number',
            fields: ['u64'],
          },
        ],
      },
    },
  ],
};
