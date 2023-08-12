import { NetworkId, NetworkIdType, networks } from '@sonarwatch/portfolio-core';
import { LendingConfig } from './types';

export const lendingConfigs: Map<NetworkIdType, LendingConfig[]> = new Map([
  [
    NetworkId.avalanche,
    [
      {
        chainId: networks.avalanche.chainId,
        networkId: NetworkId.avalanche,
        elementName: 'Aave V3',
        lendingPoolAddressProvider:
          '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
        uiIncentiveDataProviderAddress:
          '0x265d414f80b0fca9505710e6F16dB4b67555D365',
        uiPoolDataProviderAddress: '0xF71DBe0FAEF1473ffC607d4c555dfF0aEaDb878d',
      },
      {
        chainId: networks.avalanche.chainId,
        networkId: NetworkId.avalanche,
        elementName: 'Aave V2',
        lendingPoolAddressProvider:
          '0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f',
        uiIncentiveDataProviderAddress:
          '0x11979886A6dBAE27D7a72c49fCF3F23240D647bF',
        uiPoolDataProviderAddress: '0x00e50FAB64eBB37b87df06Aa46b8B35d5f1A4e1A',
      },
    ],
  ],
  [
    NetworkId.polygon,
    [
      {
        chainId: networks.polygon.chainId,
        networkId: NetworkId.polygon,
        elementName: 'Aave V2',
        lendingPoolAddressProvider:
          '0xd05e3E715d945B59290df0ae8eF85c1BdB684744',
        uiIncentiveDataProviderAddress:
          '0x645654D59A5226CBab969b1f5431aA47CBf64ab8',
        uiPoolDataProviderAddress: '0x204f2Eb81D996729829debC819f7992DCEEfE7b1',
      },
      {
        chainId: networks.polygon.chainId,
        networkId: NetworkId.polygon,
        elementName: 'Aave V3',
        lendingPoolAddressProvider:
          '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
        uiIncentiveDataProviderAddress:
          '0x874313A46e4957D29FAAC43BF5Eb2B144894f557',
        uiPoolDataProviderAddress: '0xC69728f11E9E6127733751c8410432913123acf1',
      },
    ],
  ],
  [
    NetworkId.ethereum,
    [
      {
        chainId: networks.ethereum.chainId,
        networkId: NetworkId.ethereum,
        elementName: 'Aave V2 Main',
        lendingPoolAddressProvider:
          '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
        uiIncentiveDataProviderAddress:
          '0xD01ab9a6577E1D84F142e44D49380e23A340387d',
        uiPoolDataProviderAddress: '0x00e50FAB64eBB37b87df06Aa46b8B35d5f1A4e1A',
      },
      {
        chainId: networks.ethereum.chainId,
        networkId: NetworkId.ethereum,
        elementName: 'Aave V2 AMM',
        lendingPoolAddressProvider:
          '0xAcc030EF66f9dFEAE9CbB0cd1B25654b82cFA8d5',
        uiIncentiveDataProviderAddress:
          '0xD01ab9a6577E1D84F142e44D49380e23A340387d',
        uiPoolDataProviderAddress: '0x00e50FAB64eBB37b87df06Aa46b8B35d5f1A4e1A',
      },
      {
        chainId: networks.ethereum.chainId,
        networkId: NetworkId.ethereum,
        elementName: 'Aave V3 AMM',
        lendingPoolAddressProvider:
          '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
        uiIncentiveDataProviderAddress:
          '0x162A7AC02f547ad796CA549f757e2b8d1D9b10a6',
        uiPoolDataProviderAddress: '0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d',
      },
    ],
  ],
]);

export const platformId = 'aave';
