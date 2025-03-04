import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { coinInfo } from '../../utils/aptos';
import { StakerInfo } from './types';
import { UniswapNetworkConfig } from '../uniswap/types';

export const platformId = 'pancakeswap';
export const platform: Platform = {
  id: platformId,
  name: 'PancakeSwap',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/pancakeswap.webp',
  defiLlamaId: 'parent#pancakeswap',
  website: 'https://pancakeswap.finance/',
};
export const programAddress =
  '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa';

export const lpTypePrefix = `${programAddress}::swap::LPToken<`;
export const lpCoinInfoTypePrefix = `${coinInfo}<${lpTypePrefix}`;

export const theGraphUrlEthV2 =
  'https://api.thegraph.com/subgraphs/name/pancakeswap/exhange-eth';

export const factoryV2Bnb = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73';

// See all Subgraph links : https://docs.pancakeswap.finance/developers/api/subgraph

export const stakersBnb: StakerInfo[] = [
  {
    contract: '0xa683C30d47BCd31fB1399b80A4475bc960b903e3',
    decimals: 18,
    token: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
  {
    contract: '0xDe9FC6485b5f4A1905d8011fcd201EB78CF34073',
    decimals: 18,
    token: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
  {
    contract: '0x7cE7A5C3241629763899474500D8db1fDFf1dab6',
    decimals: 18,
    token: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
  {
    contract: '0x08C9d626a2F0CC1ed9BD07eBEdeF8929F45B83d3',
    decimals: 18,
    token: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
  {
    contract: '0x68Cc90351a79A4c10078FE021bE430b7a12aaA09',
    decimals: 18,
    token: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
  {
    contract: '0x365F744c8b7608253697cA2Ed561537B65a3438B',
    decimals: 18,
    token: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
];

export const stakerCake: StakerInfo[] = [
  {
    contract: '0x45c54210128a065de780C4B0Df3d16664f7f859e',
    decimals: 18,
    token: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
];

export const stakersEthereum: StakerInfo[] = [
  {
    contract: '0xd7136b50e641cfff9d0aeb5c4617c779a80f0c8b',
    decimals: 18,
    token: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
  },
  {
    contract: '0x5a8c87047c290dd8a2e1a1a2d2341da41d1aa009',
    decimals: 18,
    token: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
  },
  {
    contract: '0x5ec855219e236b75e7cfba0d56105b9cc88b4a18',
    decimals: 18,
    token: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
  },
  {
    contract: '0x3bb1cca68756a7e0ffebf59d52174784047f3de8',
    decimals: 18,
    token: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
  },
];

export const stakerCakeEthereum: StakerInfo[] = [
  {
    contract: '0x45c54210128a065de780C4B0Df3d16664f7f859e',
    decimals: 18,
    token: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
];

export const masterChefBnb = '0x73feaa1eE314F8c655E354234017bE2193C9E24E';
export const masterChefV2Bnb = '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652';
export const masterChefV2Ethereum =
  '0x2e71b2688019ebdfdde5a45e6921aaebb15b25fb';

export const networksConfigs: UniswapNetworkConfig[] = [
  {
    networkId: NetworkId.bnb,
    factory: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    positionManager: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  },
  {
    networkId: NetworkId.ethereum,
    factory: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    positionManager: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  },
];
