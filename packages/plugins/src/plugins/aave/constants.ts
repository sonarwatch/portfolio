import {
  NetworkId,
  NetworkIdType,
  Platform,
  networks,
} from '@sonarwatch/portfolio-core';
import { LendingConfig } from './types';

export const platformId = 'aave';
export const platform: Platform = {
  id: platformId,
  name: 'AAVE',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/aave.webp',
  defiLlamaId: 'parent#aave',
  website: 'https://aave.com/',
};

export const aaveAddress = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9';
export const aaveDecimals = 18;
export const stkAaveAddress = '0x4da27a545c0c5b758a6ba100e3a049001de870f5';
export const stkAaveDecimals = 18;
export const stkAbptAddress = '0xa1116930326d21fb917d5a27f1e9943a9595fb47';
export const stkAbptDecimals = 18;
export const abptAddress = '0xC697051d1C6296C24aE3bceF39acA743861D9A81';
export const abptDecimals = 18;

export const lendingConfigs: Map<NetworkIdType, LendingConfig[]> = new Map([
  [
    NetworkId.avalanche,
    [
      {
        chainId: networks.avalanche.chainId,
        networkId: NetworkId.avalanche,
        elementName: 'Aave V2',
        lendingPoolAddressProvider:
          '0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f',
        uiIncentiveDataProviderAddress:
          '0x11979886A6dBAE27D7a72c49fCF3F23240D647bF',
        uiPoolDataProviderAddress: '0x00e50FAB64eBB37b87df06Aa46b8B35d5f1A4e1A',
        version: 2,
      },
      {
        chainId: networks.avalanche.chainId,
        networkId: NetworkId.avalanche,
        elementName: 'Aave V3',
        lendingPoolAddressProvider:
          '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
        uiIncentiveDataProviderAddress:
          '0x265d414f80b0fca9505710e6F16dB4b67555D365',
        uiPoolDataProviderAddress: '0x374a2592f0265b3bb802d75809e61b1b5BbD85B7',
        version: 3,
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
        version: 2,
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
        version: 3,
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
        version: 2,
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
        version: 2,
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
        version: 3,
      },
    ],
  ],
]);
