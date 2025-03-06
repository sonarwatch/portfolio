import { PublicKey } from '@solana/web3.js';
import {
  Contract,
  NetworkId,
  Platform,
  Service,
} from '@sonarwatch/portfolio-core';

export const platformId = 'raydium';
export const platform: Platform = {
  id: platformId,
  name: 'Raydium',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/raydium.webp',
  defiLlamaId: 'raydium',
  website: 'https://raydium.io/',
};

export const apiV3 = 'https://api-v3.raydium.io/';

const raydiumAmmV3Contract: Contract = {
  name: 'Raydium AMM v3',
  address: 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q',
};
const raydiumAmmV4Contract: Contract = {
  name: 'Raydium AMM v4',
  address: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
};
const raydiumAmmV5Contract: Contract = {
  name: 'Raydium AMM v5',
  address: '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h',
};
const raydiumClmmContract: Contract = {
  name: 'Raydium CLMM',
  address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
};
const raydiumCpmmContract: Contract = {
  name: 'Raydium CPMM',
  address: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
};

export const AMM_PROGRAM_ID_V3 = new PublicKey(raydiumAmmV3Contract.address);

export const AMM_PROGRAM_ID_V4 = new PublicKey(raydiumAmmV4Contract.address);
export const AMM_PROGRAM_ID_V5 = new PublicKey(raydiumAmmV5Contract.address);

export const raydiumProgram = new PublicKey(raydiumClmmContract.address);

export const cpmmProgramId = new PublicKey(raydiumCpmmContract.address);

export const positionsIdentifier = 'Raydium Concentrated Liquidity';

export const rayMint = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R';
export const rayDecimals = 6;

export const pluginServices: Service[] = [
  {
    id: `${platformId}-amm-v3`,
    name: 'AMM v3',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV3Contract],
  },
  {
    id: `${platformId}-amm-v4`,
    name: 'AMM v4',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV4Contract],
  },
  {
    id: `${platformId}-amm-v5`,
    name: 'AMM v5',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV5Contract],
  },
  {
    id: `${platformId}-clmm`,
    name: 'CLMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumClmmContract],
  },
  {
    id: `${platformId}-cpmm`,
    name: 'CPMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumCpmmContract],
  },
];
