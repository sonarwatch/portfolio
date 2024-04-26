import {
  Contract,
  NetworkId,
  Service,
  ServiceConfig,
} from '@sonarwatch/portfolio-core';
import { platformId } from './constants';

export const ethV2MainLendProvider: Contract = {
  address: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
  name: 'Aave V2 Main Lenging Pool Provider',
  network: NetworkId.ethereum,
};

export const ethV2AMMLendProvider: Contract = {
  address: '0xAcc030EF66f9dFEAE9CbB0cd1B25654b82cFA8d5',
  name: 'Aave V2 AMM Lenging Pool Provider',
  network: NetworkId.ethereum,
};

export const ethV2IncentiveProvider: Contract = {
  address: '0xD01ab9a6577E1D84F142e44D49380e23A340387d',
  name: 'Aave V2 Incentive Provider',
  network: NetworkId.ethereum,
};

export const ethV2DataProvider: Contract = {
  address: '0x00e50FAB64eBB37b87df06Aa46b8B35d5f1A4e1A',
  name: 'Aave V2 Data Provider',
  network: NetworkId.ethereum,
};

export const polygonV2LendProvider: Contract = {
  address: '0xd05e3E715d945B59290df0ae8eF85c1BdB684744',
  name: 'Aave V2 Lenging Pool Provider',
  network: NetworkId.polygon,
};

export const polygonV2IncentiveProvider: Contract = {
  address: '0x874313A46e4957D29FAAC43BF5Eb2B144894f557',
  name: 'Aave V2 Incentive Provider',
  network: NetworkId.polygon,
};

export const polygonV2DataProvider: Contract = {
  address: '0xC69728f11E9E6127733751c8410432913123acf1',
  name: 'Aave V2 Data Provider',
  network: NetworkId.polygon,
};

export const avalancheV2LendProvider: Contract = {
  address: '0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f',
  name: 'Aave V2 Lenging Pool Provider',
  network: NetworkId.avalanche,
};

export const avalancheV2IncentiveProvider: Contract = {
  address: '0x11979886A6dBAE27D7a72c49fCF3F23240D647bF',
  name: 'Aave V2 Incentive Provider',
  network: NetworkId.avalanche,
};

export const avalancheV2DataProvider: Contract = {
  address: '0x00e50FAB64eBB37b87df06Aa46b8B35d5f1A4e1A',
  name: 'Aave V2 Data Provider',
  network: NetworkId.avalanche,
};

export const ethMainV2Config: ServiceConfig = {
  integratedOn: 1692489600000,
  networkId: NetworkId.ethereum,
  contracts: [ethV2MainLendProvider, ethV2IncentiveProvider, ethV2DataProvider],
  link: 'https://app.aave.com/?marketName=proto_mainnet',
};

export const ethAMMV2Config: ServiceConfig = {
  integratedOn: 1692489600000,
  networkId: NetworkId.ethereum,
  contracts: [ethV2AMMLendProvider, ethV2IncentiveProvider, ethV2DataProvider],
  link: 'https://app.aave.com/?marketName=amm_mainnet',
};

export const polygonV2Config: ServiceConfig = {
  integratedOn: 1692489600000,
  networkId: NetworkId.polygon,
  contracts: [
    polygonV2LendProvider,
    polygonV2IncentiveProvider,
    polygonV2DataProvider,
  ],
  link: 'https://app.aave.com/?marketName=proto_polygon',
};

export const avalancheV2Config: ServiceConfig = {
  integratedOn: 1692489600000,
  networkId: NetworkId.avalanche,
  contracts: [
    avalancheV2LendProvider,
    avalancheV2IncentiveProvider,
    avalancheV2DataProvider,
  ],
  link: 'https://app.aave.com/?marketName=proto_avalanche',
};

export const lendingV2: Service = {
  id: `${platformId}_v2`,
  platformId,
  name: 'Aave V2',
  configs: [
    ethMainV2Config,
    ethAMMV2Config,
    polygonV2Config,
    avalancheV2Config,
  ],
};

export const v3LendProviderAddress =
  '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb';

export const avalancheV3LendProvider: Contract = {
  address: v3LendProviderAddress,
  name: 'Aave V3 Lenging Pool Provider',
  network: NetworkId.avalanche,
};
export const avalancheV3IncentiveProvider: Contract = {
  address: '0x645654D59A5226CBab969b1f5431aA47CBf64ab8',
  name: 'Aave V3 Incentive Provider',
  network: NetworkId.avalanche,
};

export const avalancheV3DataProvider: Contract = {
  address: '0x204f2Eb81D996729829debC819f7992DCEEfE7b1',
  name: 'Aave V3 Data Provider',
  network: NetworkId.avalanche,
};

export const polygonV3LendProvider: Contract = {
  address: v3LendProviderAddress,
  name: 'Aave V3 Lenging Pool Provider',
  network: NetworkId.polygon,
};

export const polygonV3IncentiveProvider: Contract = {
  address: '0x874313A46e4957D29FAAC43BF5Eb2B144894f557',
  name: 'Aave V3 Incentive Provider',
  network: NetworkId.polygon,
};

export const polygonV3DataProvider: Contract = {
  address: '0xC69728f11E9E6127733751c8410432913123acf1',
  name: 'Aave V3 Data Provider',
  network: NetworkId.polygon,
};

export const ethereumV3LendProvider: Contract = {
  address: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
  name: 'Aave V3 Lenging Pool Provider',
  network: NetworkId.ethereum,
};

export const ethereumV3IncentiveProvider: Contract = {
  address: '0x162A7AC02f547ad796CA549f757e2b8d1D9b10a6',
  name: 'Aave V3 Incentive Provider',
  network: NetworkId.ethereum,
};

export const ethereumV3DataProvider: Contract = {
  address: '0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d',
  name: 'Aave V3 Data Provider',
  network: NetworkId.ethereum,
};

export const avalancheV3Config: ServiceConfig = {
  integratedOn: 1692489600000,
  networkId: NetworkId.avalanche,
  contracts: [
    avalancheV3LendProvider,
    avalancheV3IncentiveProvider,
    avalancheV3DataProvider,
  ],
  link: 'https://app.aave.com/?marketName=proto_avalanche_v3',
};

export const polygonV3Config: ServiceConfig = {
  integratedOn: 1692489600000,
  networkId: NetworkId.polygon,
  contracts: [
    polygonV3LendProvider,
    polygonV3IncentiveProvider,
    polygonV3DataProvider,
  ],
  link: 'https://app.aave.com/?marketName=proto_polygon_v3',
};

export const ethereumV3Config: ServiceConfig = {
  integratedOn: 1692489600000,
  networkId: NetworkId.ethereum,
  contracts: [
    ethereumV3LendProvider,
    ethereumV3IncentiveProvider,
    ethereumV3DataProvider,
  ],
  link: 'https://app.aave.com/?marketName=proto_mainnet_v3',
};

export const lendingV3: Service = {
  id: `${platformId}_v3`,
  platformId,
  name: 'Aave V3',
  configs: [ethereumV3Config, polygonV3Config, avalancheV3Config],
};
