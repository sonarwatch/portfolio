import {
  EvmNetworkIdType,
  NetworkId,
  networks,
} from '@sonarwatch/portfolio-core';
import {
  AaveSafetyModule,
  AaveV2Avalanche,
  AaveV2Ethereum,
  AaveV2EthereumAMM,
  AaveV2Polygon,
  AaveV3Avalanche,
  AaveV3Ethereum,
  AaveV3EthereumEtherFi,
  AaveV3EthereumLido,
  AaveV3Polygon,
  GhoEthereum,
} from '@bgd-labs/aave-address-book';
import { Address } from 'viem';
import { LendingConfig, StakingConfig, YieldConfig } from './types';

// export const platformId = 'aave'; // reserved for v1
export const aave2PlatformId = 'aave2';
export const aave3PlatformId = 'aave3';

export const lendingPoolsPrefix = 'aave-lendingPools';
export const yieldPoolsPrefix = 'aave-yieldPools';
export const yieldAssetsPrefix = 'aave-yieldAssets';

export const aaveAddress: Address = AaveV2Ethereum.ASSETS.AAVE.UNDERLYING;

const AVALANCE_NETWORK_ID = NetworkId.avalanche;
const AVALANCHE_NETWORK = networks[AVALANCE_NETWORK_ID];

const POLYGON_NETWORK_ID = NetworkId.polygon;
const POLYGON_NETWORK = networks[POLYGON_NETWORK_ID];

const ETHEREUM_NETWORK_ID = NetworkId.ethereum;
const ETHEREUM_NETWORK = networks[ETHEREUM_NETWORK_ID];

export const stakingConfigs: StakingConfig[] = [
  {
    name: 'AAVE V2 Staking',
    platformId: aave2PlatformId,
    stakingTokenAddress: AaveSafetyModule.STK_AAVE,
    stakedAssetAddress: aaveAddress,
    rewardAssetAddress: aaveAddress,
  },
  {
    name: 'AAVE V2 ABPT Staking',
    platformId: aave2PlatformId,
    stakingTokenAddress: AaveSafetyModule.STK_ABPT,
    stakedAssetAddress: '0x41A08648C3766F9F9d85598fF102a08f4ef84F84', // abpt
    rewardAssetAddress: aaveAddress,
  },
  {
    name: 'AAVE V3 GHO Staking',
    platformId: aave3PlatformId,
    stakingTokenAddress: AaveSafetyModule.STK_GHO,
    stakedAssetAddress: GhoEthereum.GHO_TOKEN,
    rewardAssetAddress: aaveAddress,
  },
  {
    name: 'AAVE V3 AAVE/WSTETH Staking',
    platformId: aave3PlatformId,
    stakingTokenAddress: AaveSafetyModule.STK_AAVE_WSTETH_BPTV2,
    stakedAssetAddress: '0x3de27EFa2F1AA663Ae5D458857e731c129069F29', // aaveWstethBptv2
    rewardAssetAddress: aaveAddress,
  },
];

export const v2lendingConfigs: Map<EvmNetworkIdType, LendingConfig[]> = new Map(
  [
    [
      AVALANCE_NETWORK_ID,
      [
        {
          chainId: AVALANCHE_NETWORK.chainId,
          networkId: AVALANCE_NETWORK_ID,
          elementName: 'Aave V2',
          lendingPoolAddressProvider: AaveV2Avalanche.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV2Avalanche.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress: AaveV2Avalanche.UI_POOL_DATA_PROVIDER,
          version: 2,
        },
      ],
    ],
    [
      POLYGON_NETWORK_ID,
      [
        {
          chainId: POLYGON_NETWORK.chainId,
          networkId: POLYGON_NETWORK_ID,
          elementName: 'Aave V2',
          lendingPoolAddressProvider: AaveV2Polygon.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV2Polygon.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress: AaveV2Polygon.UI_POOL_DATA_PROVIDER,
          version: 2,
        },
      ],
    ],
    [
      ETHEREUM_NETWORK_ID,
      [
        {
          chainId: ETHEREUM_NETWORK.chainId,
          networkId: ETHEREUM_NETWORK_ID,
          elementName: 'Aave V2',
          lendingPoolAddressProvider: AaveV2Ethereum.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV2Ethereum.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress: AaveV2Ethereum.UI_POOL_DATA_PROVIDER,
          version: 2,
        },
        {
          chainId: ETHEREUM_NETWORK.chainId,
          networkId: ETHEREUM_NETWORK_ID,
          elementName: 'Aave V2 AMM',
          lendingPoolAddressProvider: AaveV2EthereumAMM.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV2EthereumAMM.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress: AaveV2EthereumAMM.UI_POOL_DATA_PROVIDER,
          version: 2,
        },
      ],
    ],
  ]
);

export const v3lendingConfigs: Map<EvmNetworkIdType, LendingConfig[]> = new Map(
  [
    [
      AVALANCE_NETWORK_ID,
      [
        {
          chainId: AVALANCHE_NETWORK.chainId,
          networkId: AVALANCE_NETWORK_ID,
          elementName: 'Aave V3',
          lendingPoolAddressProvider: AaveV3Avalanche.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV3Avalanche.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress: AaveV3Avalanche.UI_POOL_DATA_PROVIDER,
          version: 3,
        },
      ],
    ],
    [
      POLYGON_NETWORK_ID,
      [
        {
          chainId: POLYGON_NETWORK.chainId,
          networkId: POLYGON_NETWORK_ID,
          elementName: 'Aave V3',
          lendingPoolAddressProvider: AaveV3Polygon.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV3Polygon.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress: AaveV3Polygon.UI_POOL_DATA_PROVIDER,
          version: 3,
        },
      ],
    ],
    [
      ETHEREUM_NETWORK_ID,
      [
        {
          chainId: ETHEREUM_NETWORK.chainId,
          networkId: ETHEREUM_NETWORK_ID,
          elementName: 'Aave V3 Core',
          lendingPoolAddressProvider: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress: AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
          version: 3,
        },
        {
          chainId: ETHEREUM_NETWORK.chainId,
          networkId: ETHEREUM_NETWORK_ID,
          elementName: 'Aave V3 Lido',
          lendingPoolAddressProvider:
            AaveV3EthereumLido.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV3EthereumLido.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress: AaveV3EthereumLido.UI_POOL_DATA_PROVIDER,
          version: 3,
        },
        {
          chainId: ETHEREUM_NETWORK.chainId,
          networkId: ETHEREUM_NETWORK_ID,
          elementName: 'Aave V3 EtherFi',
          lendingPoolAddressProvider:
            AaveV3EthereumEtherFi.POOL_ADDRESSES_PROVIDER,
          uiIncentiveDataProviderAddress:
            AaveV3EthereumEtherFi.UI_INCENTIVE_DATA_PROVIDER,
          uiPoolDataProviderAddress:
            AaveV3EthereumEtherFi.UI_POOL_DATA_PROVIDER,
          version: 3,
        },
      ],
    ],
  ]
);

export const combinedLendingConfigs: Map<EvmNetworkIdType, LendingConfig[]> =
  new Map([
    [
      AVALANCE_NETWORK_ID,
      [
        ...(v2lendingConfigs.get(AVALANCE_NETWORK_ID) || []),
        ...(v3lendingConfigs.get(AVALANCE_NETWORK_ID) || []),
      ],
    ],
    [
      POLYGON_NETWORK_ID,
      [
        ...(v2lendingConfigs.get(POLYGON_NETWORK_ID) || []),
        ...(v3lendingConfigs.get(POLYGON_NETWORK_ID) || []),
      ],
    ],
    [
      ETHEREUM_NETWORK_ID,
      [
        ...(v2lendingConfigs.get(ETHEREUM_NETWORK_ID) || []),
        ...(v3lendingConfigs.get(ETHEREUM_NETWORK_ID) || []),
      ],
    ],
  ]);

export const yieldConfigs: Map<EvmNetworkIdType, YieldConfig[]> = new Map([
  [
    AVALANCE_NETWORK_ID,
    [
      {
        factory: AaveV3Avalanche.STATA_FACTORY,
        networkId: AVALANCE_NETWORK_ID,
        elementName: 'Aave V3 Static Yield',
        isLegacy: false,
      },
      {
        factory: AaveV3Avalanche.LEGACY_STATIC_A_TOKEN_FACTORY,
        networkId: AVALANCE_NETWORK_ID,
        elementName: 'Aave V3 Legacy Static Yield',
        isLegacy: true,
      },
    ],
  ],
  [
    POLYGON_NETWORK_ID,
    [
      {
        factory: AaveV3Polygon.STATA_FACTORY,
        networkId: POLYGON_NETWORK_ID,
        elementName: 'Aave V3 Static Yield',
        isLegacy: false,
      },
      {
        factory: AaveV3Polygon.LEGACY_STATIC_A_TOKEN_FACTORY,
        networkId: POLYGON_NETWORK_ID,
        elementName: 'Aave V3 Legacy Static Yield',
        isLegacy: true,
      },
    ],
  ],
  [
    ETHEREUM_NETWORK_ID,
    [
      {
        factory: AaveV3Ethereum.STATA_FACTORY,
        networkId: ETHEREUM_NETWORK_ID,
        elementName: 'Aave V3 Static Yield',
        isLegacy: false,
      },
      {
        factory: AaveV3Ethereum.LEGACY_STATIC_A_TOKEN_FACTORY,
        networkId: ETHEREUM_NETWORK_ID,
        elementName: 'Aave V3 Legacy Static Yield',
        isLegacy: true,
      },
      {
        factory: AaveV3EthereumLido.STATA_FACTORY,
        networkId: ETHEREUM_NETWORK_ID,
        elementName: 'Aave V3 Lido Static Yield',
        isLegacy: false,
      },
    ],
  ],
]);
