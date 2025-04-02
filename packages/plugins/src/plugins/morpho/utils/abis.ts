export const MorphoAaveV3Abi = [
  {
    inputs: [],
    name: 'AddressIsZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AmountIsZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnsafeCast',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AssetIsCollateralOnMorpho',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AssetNotCollateralOnMorpho',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AssetNotCollateralOnPool',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BorrowIsPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BorrowNotEnabled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BorrowNotPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ClaimRewardsPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CollateralIsZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DebtIsZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExceedsBorrowCap',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExceedsMaxBasisPoints',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InconsistentEMode',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNonce',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSignatory',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidValueS',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidValueV',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LiquidateBorrowIsPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LiquidateCollateralIsPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketAlreadyCreated',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketIsDeprecated',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketIsNotListedOnAave',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketLtTooLow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketNotCreated',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PermissionDenied',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RepayIsPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SentinelBorrowNotEnabled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SentinelLiquidateNotEnabled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SetAsCollateralOnPoolButMarketNotCreated',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SignatureExpired',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SiloedBorrowMarket',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SupplyCollateralIsPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SupplyIsPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SupplyIsZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnauthorizedBorrow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnauthorizedLiquidate',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnauthorizedWithdraw',
    type: 'error',
  },
  {
    inputs: [],
    name: 'WithdrawCollateralIsPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'WithdrawIsPaused',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledOnPool',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledInP2P',
        type: 'uint256',
      },
    ],
    name: 'BorrowPositionUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledOnPool',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledInP2P',
        type: 'uint256',
      },
    ],
    name: 'Borrowed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledBalance',
        type: 'uint256',
      },
    ],
    name: 'CollateralSupplied',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledBalance',
        type: 'uint256',
      },
    ],
    name: 'CollateralWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint128',
        name: 'repay',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'withdraw',
        type: 'uint128',
      },
    ],
    name: 'DefaultIterationsSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'idleSupply',
        type: 'uint256',
      },
    ],
    name: 'IdleSupplyUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolSupplyIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'p2pSupplyIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolBorrowIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'p2pBorrowIndex',
        type: 'uint256',
      },
    ],
    name: 'IndexesUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsBorrowPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsClaimRewardsPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isCollateral',
        type: 'bool',
      },
    ],
    name: 'IsCollateralSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isDeprecated',
        type: 'bool',
      },
    ],
    name: 'IsDeprecatedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsLiquidateBorrowPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsLiquidateCollateralPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isP2PDisabled',
        type: 'bool',
      },
    ],
    name: 'IsP2PDisabledSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsRepayPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsSupplyCollateralPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsSupplyPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsWithdrawCollateralPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'IsWithdrawPausedSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'liquidator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlyingBorrowed',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountLiquidated',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'underlyingCollateral',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountSeized',
        type: 'uint256',
      },
    ],
    name: 'Liquidated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'delegator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isAllowed',
        type: 'bool',
      },
    ],
    name: 'ManagerApproval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
    ],
    name: 'MarketCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledDelta',
        type: 'uint256',
      },
    ],
    name: 'P2PBorrowDeltaUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'P2PDeltasIncreased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'p2pIndexCursor',
        type: 'uint16',
      },
    ],
    name: 'P2PIndexCursorSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledDelta',
        type: 'uint256',
      },
    ],
    name: 'P2PSupplyDeltaUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledTotalSupplyP2P',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledTotalBorrowP2P',
        type: 'uint256',
      },
    ],
    name: 'P2PTotalsUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'positionsManager',
        type: 'address',
      },
    ],
    name: 'PositionsManagerSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'repayer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledOnPool',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledInP2P',
        type: 'uint256',
      },
    ],
    name: 'Repaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'reserveFactor',
        type: 'uint16',
      },
    ],
    name: 'ReserveFactorSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'claimed',
        type: 'uint256',
      },
    ],
    name: 'ReserveFeeClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'rewardToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountClaimed',
        type: 'uint256',
      },
    ],
    name: 'RewardsClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'rewardsManager',
        type: 'address',
      },
    ],
    name: 'RewardsManagerSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledOnPool',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledInP2P',
        type: 'uint256',
      },
    ],
    name: 'Supplied',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledOnPool',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledInP2P',
        type: 'uint256',
      },
    ],
    name: 'SupplyPositionUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'treasuryVault',
        type: 'address',
      },
    ],
    name: 'TreasuryVaultSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'signatory',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usedNonce',
        type: 'uint256',
      },
    ],
    name: 'UserNonceIncremented',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledOnPool',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scaledInP2P',
        type: 'uint256',
      },
    ],
    name: 'Withdrawn',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'addressesProvider',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isAllowed',
        type: 'bool',
      },
    ],
    name: 'approveManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isAllowed',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        internalType: 'struct Types.Signature',
        name: 'signature',
        type: 'tuple',
      },
    ],
    name: 'approveManagerWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'maxIterations',
        type: 'uint256',
      },
    ],
    name: 'borrow',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'borrowBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
    ],
    name: 'claimRewards',
    outputs: [
      {
        internalType: 'address[]',
        name: 'rewardTokens',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'claimedAmounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'underlyings',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    name: 'claimToTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'collateralBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'reserveFactor',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'p2pIndexCursor',
        type: 'uint16',
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultIterations',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'repay',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'withdraw',
            type: 'uint128',
          },
        ],
        internalType: 'struct Types.Iterations',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eModeCategoryId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'enum Types.Position',
        name: 'position',
        type: 'uint8',
      },
    ],
    name: 'getBucketsMask',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'enum Types.Position',
        name: 'position',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getNext',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'increaseP2PDeltas',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addressesProvider',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'eModeCategoryId',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: 'positionsManager',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint128',
            name: 'repay',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'withdraw',
            type: 'uint128',
          },
        ],
        internalType: 'struct Types.Iterations',
        name: 'defaultIterations',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isClaimRewardsPaused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
    ],
    name: 'isManagedBy',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlyingBorrowed',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'underlyingCollateral',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'liquidate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'liquidityData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'borrowable',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxDebt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'debt',
            type: 'uint256',
          },
        ],
        internalType: 'struct Types.LiquidityData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
    ],
    name: 'market',
    outputs: [
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'uint128',
                    name: 'poolIndex',
                    type: 'uint128',
                  },
                  {
                    internalType: 'uint128',
                    name: 'p2pIndex',
                    type: 'uint128',
                  },
                ],
                internalType: 'struct Types.MarketSideIndexes',
                name: 'supply',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint128',
                    name: 'poolIndex',
                    type: 'uint128',
                  },
                  {
                    internalType: 'uint128',
                    name: 'p2pIndex',
                    type: 'uint128',
                  },
                ],
                internalType: 'struct Types.MarketSideIndexes',
                name: 'borrow',
                type: 'tuple',
              },
            ],
            internalType: 'struct Types.Indexes',
            name: 'indexes',
            type: 'tuple',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'scaledDelta',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'scaledP2PTotal',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Types.MarketSideDelta',
                name: 'supply',
                type: 'tuple',
              },
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'scaledDelta',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'scaledP2PTotal',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Types.MarketSideDelta',
                name: 'borrow',
                type: 'tuple',
              },
            ],
            internalType: 'struct Types.Deltas',
            name: 'deltas',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'underlying',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'bool',
                name: 'isP2PDisabled',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isSupplyPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isSupplyCollateralPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isBorrowPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isWithdrawPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isWithdrawCollateralPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isRepayPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isLiquidateCollateralPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isLiquidateBorrowPaused',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'isDeprecated',
                type: 'bool',
              },
            ],
            internalType: 'struct Types.PauseStatuses',
            name: 'pauseStatuses',
            type: 'tuple',
          },
          {
            internalType: 'bool',
            name: 'isCollateral',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'variableDebtToken',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'lastUpdateTimestamp',
            type: 'uint32',
          },
          {
            internalType: 'uint16',
            name: 'reserveFactor',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'p2pIndexCursor',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'aToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'stableDebtToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'idleSupply',
            type: 'uint256',
          },
        ],
        internalType: 'struct Types.Market',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'marketsCreated',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pool',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'positionsManager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
    ],
    name: 'repay',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        internalType: 'struct Types.Signature',
        name: 'signature',
        type: 'tuple',
      },
    ],
    name: 'repayWithPermit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardsManager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'scaledCollateralBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'scaledP2PBorrowBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'scaledP2PSupplyBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'scaledPoolBorrowBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'scaledPoolSupplyBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isCollateral',
        type: 'bool',
      },
    ],
    name: 'setAssetIsCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isCollateral',
        type: 'bool',
      },
    ],
    name: 'setAssetIsCollateralOnPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'repay',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'withdraw',
            type: 'uint128',
          },
        ],
        internalType: 'struct Types.Iterations',
        name: 'defaultIterations',
        type: 'tuple',
      },
    ],
    name: 'setDefaultIterations',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsBorrowPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsClaimRewardsPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isDeprecated',
        type: 'bool',
      },
    ],
    name: 'setIsDeprecated',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsLiquidateBorrowPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsLiquidateCollateralPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isP2PDisabled',
        type: 'bool',
      },
    ],
    name: 'setIsP2PDisabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsPausedForAllMarkets',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsRepayPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsSupplyCollateralPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsSupplyPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsWithdrawCollateralPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPaused',
        type: 'bool',
      },
    ],
    name: 'setIsWithdrawPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'p2pIndexCursor',
        type: 'uint16',
      },
    ],
    name: 'setP2PIndexCursor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'positionsManager',
        type: 'address',
      },
    ],
    name: 'setPositionsManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'newReserveFactor',
        type: 'uint16',
      },
    ],
    name: 'setReserveFactor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'rewardsManager',
        type: 'address',
      },
    ],
    name: 'setRewardsManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'treasuryVault',
        type: 'address',
      },
    ],
    name: 'setTreasuryVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'maxIterations',
        type: 'uint256',
      },
    ],
    name: 'supply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'supplyBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
    ],
    name: 'supplyCollateral',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        internalType: 'struct Types.Signature',
        name: 'signature',
        type: 'tuple',
      },
    ],
    name: 'supplyCollateralWithPermit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'maxIterations',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        internalType: 'struct Types.Signature',
        name: 'signature',
        type: 'tuple',
      },
    ],
    name: 'supplyWithPermit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasuryVault',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
    ],
    name: 'updatedIndexes',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'poolIndex',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'p2pIndex',
                type: 'uint256',
              },
            ],
            internalType: 'struct Types.MarketSideIndexes256',
            name: 'supply',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'poolIndex',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'p2pIndex',
                type: 'uint256',
              },
            ],
            internalType: 'struct Types.MarketSideIndexes256',
            name: 'borrow',
            type: 'tuple',
          },
        ],
        internalType: 'struct Types.Indexes256',
        name: 'indexes',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'userBorrows',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'userCollaterals',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'userNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'maxIterations',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'withdrawCollateral',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const morphoContractABI = [
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'prevBorrowRate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'interest',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeShares',
        type: 'uint256',
      },
    ],
    name: 'AccrueInterest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    name: 'Borrow',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        indexed: false,
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
    ],
    name: 'CreateMarket',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'irm', type: 'address' },
    ],
    name: 'EnableIrm',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lltv',
        type: 'uint256',
      },
    ],
    name: 'EnableLltv',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
    ],
    name: 'FlashLoan',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'authorizer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usedNonce',
        type: 'uint256',
      },
    ],
    name: 'IncrementNonce',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'repaidAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'repaidShares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'seizedAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'badDebtAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'badDebtShares',
        type: 'uint256',
      },
    ],
    name: 'Liquidate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    name: 'Repay',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'authorizer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'authorized',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'newIsAuthorized',
        type: 'bool',
      },
    ],
    name: 'SetAuthorization',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newFee',
        type: 'uint256',
      },
    ],
    name: 'SetFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newFeeRecipient',
        type: 'address',
      },
    ],
    name: 'SetFeeRecipient',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'SetOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    name: 'Supply',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
    ],
    name: 'SupplyCollateral',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalf',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
    ],
    name: 'WithdrawCollateral',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
    ],
    name: 'accrueInterest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'address', name: 'onBehalf', type: 'address' },
      { internalType: 'address', name: 'receiver', type: 'address' },
    ],
    name: 'borrow',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'irm', type: 'address' }],
    name: 'enableIrm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'lltv', type: 'uint256' }],
    name: 'enableLltv',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32[]', name: 'slots', type: 'bytes32[]' }],
    name: 'extSloads',
    outputs: [{ internalType: 'bytes32[]', name: 'res', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeRecipient',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'flashLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'Id', name: '', type: 'bytes32' }],
    name: 'idToMarketParams',
    outputs: [
      { internalType: 'address', name: 'loanToken', type: 'address' },
      { internalType: 'address', name: 'collateralToken', type: 'address' },
      { internalType: 'address', name: 'oracle', type: 'address' },
      { internalType: 'address', name: 'irm', type: 'address' },
      { internalType: 'uint256', name: 'lltv', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'isAuthorized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isIrmEnabled',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'isLltvEnabled',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'address', name: 'borrower', type: 'address' },
      { internalType: 'uint256', name: 'seizedAssets', type: 'uint256' },
      { internalType: 'uint256', name: 'repaidShares', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'liquidate',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'Id', name: '', type: 'bytes32' }],
    name: 'market',
    outputs: [
      { internalType: 'uint128', name: 'totalSupplyAssets', type: 'uint128' },
      { internalType: 'uint128', name: 'totalSupplyShares', type: 'uint128' },
      { internalType: 'uint128', name: 'totalBorrowAssets', type: 'uint128' },
      { internalType: 'uint128', name: 'totalBorrowShares', type: 'uint128' },
      { internalType: 'uint128', name: 'lastUpdate', type: 'uint128' },
      { internalType: 'uint128', name: 'fee', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonce',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Id', name: '', type: 'bytes32' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'position',
    outputs: [
      { internalType: 'uint256', name: 'supplyShares', type: 'uint256' },
      { internalType: 'uint128', name: 'borrowShares', type: 'uint128' },
      { internalType: 'uint128', name: 'collateral', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'address', name: 'onBehalf', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'repay',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'authorized', type: 'address' },
      { internalType: 'bool', name: 'newIsAuthorized', type: 'bool' },
    ],
    name: 'setAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'authorizer', type: 'address' },
          { internalType: 'address', name: 'authorized', type: 'address' },
          { internalType: 'bool', name: 'isAuthorized', type: 'bool' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        internalType: 'struct Authorization',
        name: 'authorization',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct Signature',
        name: 'signature',
        type: 'tuple',
      },
    ],
    name: 'setAuthorizationWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'newFee', type: 'uint256' },
    ],
    name: 'setFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newFeeRecipient', type: 'address' },
    ],
    name: 'setFeeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'address', name: 'onBehalf', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'supply',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'address', name: 'onBehalf', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'supplyCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'address', name: 'onBehalf', type: 'address' },
      { internalType: 'address', name: 'receiver', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'address', name: 'onBehalf', type: 'address' },
      { internalType: 'address', name: 'receiver', type: 'address' },
    ],
    name: 'withdrawCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const morphoVaultABI = [
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'morpho', type: 'address' },
      { internalType: 'uint256', name: 'initialTimelock', type: 'uint256' },
      { internalType: 'address', name: '_asset', type: 'address' },
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_symbol', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'AboveMaxTimelock', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'AddressInsufficientBalance',
    type: 'error',
  },
  { inputs: [], name: 'AllCapsReached', type: 'error' },
  { inputs: [], name: 'AlreadyPending', type: 'error' },
  { inputs: [], name: 'AlreadySet', type: 'error' },
  { inputs: [], name: 'BelowMinTimelock', type: 'error' },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'DuplicateMarket',
    type: 'error',
  },
  { inputs: [], name: 'ECDSAInvalidSignature', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'length', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 's', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'allowance', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'approver', type: 'address' }],
    name: 'ERC20InvalidApprover',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
    name: 'ERC20InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
    name: 'ERC20InvalidSender',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'spender', type: 'address' }],
    name: 'ERC20InvalidSpender',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'deadline', type: 'uint256' }],
    name: 'ERC2612ExpiredSignature',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'signer', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'ERC2612InvalidSigner',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'uint256', name: 'max', type: 'uint256' },
    ],
    name: 'ERC4626ExceededMaxDeposit',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'uint256', name: 'max', type: 'uint256' },
    ],
    name: 'ERC4626ExceededMaxMint',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'uint256', name: 'max', type: 'uint256' },
    ],
    name: 'ERC4626ExceededMaxRedeem',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'uint256', name: 'max', type: 'uint256' },
    ],
    name: 'ERC4626ExceededMaxWithdraw',
    type: 'error',
  },
  { inputs: [], name: 'FailedInnerCall', type: 'error' },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'InconsistentAsset',
    type: 'error',
  },
  { inputs: [], name: 'InconsistentReallocation', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'currentNonce', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'InvalidMarketRemovalNonZeroCap',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'InvalidMarketRemovalNonZeroSupply',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'InvalidMarketRemovalTimelockNotElapsed',
    type: 'error',
  },
  { inputs: [], name: 'InvalidShortString', type: 'error' },
  { inputs: [], name: 'MarketNotCreated', type: 'error' },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'MarketNotEnabled',
    type: 'error',
  },
  { inputs: [], name: 'MathOverflowedMulDiv', type: 'error' },
  { inputs: [], name: 'MaxFeeExceeded', type: 'error' },
  { inputs: [], name: 'MaxQueueLengthExceeded', type: 'error' },
  { inputs: [], name: 'NoPendingValue', type: 'error' },
  { inputs: [], name: 'NonZeroCap', type: 'error' },
  { inputs: [], name: 'NotAllocatorRole', type: 'error' },
  { inputs: [], name: 'NotCuratorNorGuardianRole', type: 'error' },
  { inputs: [], name: 'NotCuratorRole', type: 'error' },
  { inputs: [], name: 'NotEnoughLiquidity', type: 'error' },
  { inputs: [], name: 'NotGuardianRole', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'PendingCap',
    type: 'error',
  },
  { inputs: [], name: 'PendingRemoval', type: 'error' },
  {
    inputs: [
      { internalType: 'uint8', name: 'bits', type: 'uint8' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'string', name: 'str', type: 'string' }],
    name: 'StringTooLong',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'SupplyCapExceeded',
    type: 'error',
  },
  { inputs: [], name: 'TimelockNotElapsed', type: 'error' },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'UnauthorizedMarket',
    type: 'error',
  },
  { inputs: [], name: 'ZeroAddress', type: 'error' },
  { inputs: [], name: 'ZeroFeeRecipient', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newTotalAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeShares',
        type: 'uint256',
      },
    ],
    name: 'AccrueInterest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'EIP712DomainChanged', type: 'event' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'suppliedAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'suppliedShares',
        type: 'uint256',
      },
    ],
    name: 'ReallocateSupply',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawnAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawnShares',
        type: 'uint256',
      },
    ],
    name: 'ReallocateWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
    ],
    name: 'RevokePendingCap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'RevokePendingGuardian',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
    ],
    name: 'RevokePendingMarketRemoval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'RevokePendingTimelock',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'cap', type: 'uint256' },
    ],
    name: 'SetCap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newCurator',
        type: 'address',
      },
    ],
    name: 'SetCurator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newFee',
        type: 'uint256',
      },
    ],
    name: 'SetFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newFeeRecipient',
        type: 'address',
      },
    ],
    name: 'SetFeeRecipient',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'guardian',
        type: 'address',
      },
    ],
    name: 'SetGuardian',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'allocator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isAllocator',
        type: 'bool',
      },
    ],
    name: 'SetIsAllocator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newSkimRecipient',
        type: 'address',
      },
    ],
    name: 'SetSkimRecipient',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'Id[]',
        name: 'newSupplyQueue',
        type: 'bytes32[]',
      },
    ],
    name: 'SetSupplyQueue',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newTimelock',
        type: 'uint256',
      },
    ],
    name: 'SetTimelock',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'Id[]',
        name: 'newWithdrawQueue',
        type: 'bytes32[]',
      },
    ],
    name: 'SetWithdrawQueue',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Skim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'cap', type: 'uint256' },
    ],
    name: 'SubmitCap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newGuardian',
        type: 'address',
      },
    ],
    name: 'SubmitGuardian',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      { indexed: true, internalType: 'Id', name: 'id', type: 'bytes32' },
    ],
    name: 'SubmitMarketRemoval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newTimelock',
        type: 'uint256',
      },
    ],
    name: 'SubmitTimelock',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'updatedTotalAssets',
        type: 'uint256',
      },
    ],
    name: 'UpdateLastTotalAssets',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DECIMALS_OFFSET',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MORPHO',
    outputs: [{ internalType: 'contract IMorpho', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
    ],
    name: 'acceptCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'acceptGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'acceptTimelock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'asset',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'Id', name: '', type: 'bytes32' }],
    name: 'config',
    outputs: [
      { internalType: 'uint184', name: 'cap', type: 'uint184' },
      { internalType: 'bool', name: 'enabled', type: 'bool' },
      { internalType: 'uint64', name: 'removableAt', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
    name: 'convertToAssets',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
    name: 'convertToShares',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'curator',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'address', name: 'receiver', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { internalType: 'bytes1', name: 'fields', type: 'bytes1' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'verifyingContract', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256[]', name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fee',
    outputs: [{ internalType: 'uint96', name: '', type: 'uint96' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeRecipient',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'guardian',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isAllocator',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastTotalAssets',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'maxDeposit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'maxMint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'maxRedeem',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'maxWithdraw',
    outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'address', name: 'receiver', type: 'address' },
    ],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes[]', name: 'data', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'Id', name: '', type: 'bytes32' }],
    name: 'pendingCap',
    outputs: [
      { internalType: 'uint192', name: 'value', type: 'uint192' },
      { internalType: 'uint64', name: 'validAt', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingGuardian',
    outputs: [
      { internalType: 'address', name: 'value', type: 'address' },
      { internalType: 'uint64', name: 'validAt', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingTimelock',
    outputs: [
      { internalType: 'uint192', name: 'value', type: 'uint192' },
      { internalType: 'uint64', name: 'validAt', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
    name: 'previewDeposit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
    name: 'previewMint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
    name: 'previewRedeem',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
    name: 'previewWithdraw',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'address', name: 'loanToken', type: 'address' },
              {
                internalType: 'address',
                name: 'collateralToken',
                type: 'address',
              },
              { internalType: 'address', name: 'oracle', type: 'address' },
              { internalType: 'address', name: 'irm', type: 'address' },
              { internalType: 'uint256', name: 'lltv', type: 'uint256' },
            ],
            internalType: 'struct MarketParams',
            name: 'marketParams',
            type: 'tuple',
          },
          { internalType: 'uint256', name: 'assets', type: 'uint256' },
        ],
        internalType: 'struct MarketAllocation[]',
        name: 'allocations',
        type: 'tuple[]',
      },
    ],
    name: 'reallocate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'shares', type: 'uint256' },
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'redeem',
    outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'revokePendingCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revokePendingGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'Id', name: 'id', type: 'bytes32' }],
    name: 'revokePendingMarketRemoval',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revokePendingTimelock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newCurator', type: 'address' }],
    name: 'setCurator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'newFee', type: 'uint256' }],
    name: 'setFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newFeeRecipient', type: 'address' },
    ],
    name: 'setFeeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newAllocator', type: 'address' },
      { internalType: 'bool', name: 'newIsAllocator', type: 'bool' },
    ],
    name: 'setIsAllocator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newSkimRecipient', type: 'address' },
    ],
    name: 'setSkimRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Id[]', name: 'newSupplyQueue', type: 'bytes32[]' },
    ],
    name: 'setSupplyQueue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'skim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'skimRecipient',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'newSupplyCap', type: 'uint256' },
    ],
    name: 'submitCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newGuardian', type: 'address' }],
    name: 'submitGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'loanToken', type: 'address' },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          { internalType: 'address', name: 'oracle', type: 'address' },
          { internalType: 'address', name: 'irm', type: 'address' },
          { internalType: 'uint256', name: 'lltv', type: 'uint256' },
        ],
        internalType: 'struct MarketParams',
        name: 'marketParams',
        type: 'tuple',
      },
    ],
    name: 'submitMarketRemoval',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'newTimelock', type: 'uint256' }],
    name: 'submitTimelock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'supplyQueue',
    outputs: [{ internalType: 'Id', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'supplyQueueLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'timelock',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[]', name: 'indexes', type: 'uint256[]' }],
    name: 'updateWithdrawQueue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'assets', type: 'uint256' },
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'withdrawQueue',
    outputs: [{ internalType: 'Id', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawQueueLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
