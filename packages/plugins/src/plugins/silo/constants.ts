import { NetworkId } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';

export const PLATFORM_ID = 'silo';
export const NETWORK_ID = NetworkId.ethereum;
export const SILOS_POOLS_KEY = 'silo-pools';
export const SILOS_VAULTS_KEY = 'silo-vaults';
export const SILOS_REWARD_VAULTS_KEY = 'silo-reward-vaults';
// Base URL for The Graph API
export const SUBGRAPH_URL = 'https://gateway.thegraph.com/api/subgraphs/id/';

// Ethereum Subgraph 1/3 Finance Llama
export const SILOS_GRAPH_ENDPOINT_1 = `${SUBGRAPH_URL}5cNT22xQJVEWBBigBMBicv4UZAnGxH2CeHpenTJ8Q8kA`;
// Ethereum Subgraph 2/3 Finance Mainnet
export const SILOS_GRAPH_ENDPOINT_2 = `${SUBGRAPH_URL}GTEyHhRmhRRJkQfrDWsapcZ8sBKAka4GFej6gn3BpJNq`;
// Ethereum Subgraph 3/3 Legacy
export const SILOS_GRAPH_ENDPOINT_3 = `${SUBGRAPH_URL}81ER342viJd3oRvPf28M7GwsnToa1RVWDNLnTr1eBciC`;

export const LEGACY_LENS_ADDRESS: Address =
  '0xf12C3758c1eC393704f0Db8537ef7F57368D92Ea';

export const SILOS_INCENTIVE_CONTROLLER_ADDRESSES: Address[] = [
  '0xB14F20982F2d1E5933362f5A796736D9ffa220E4',
  '0x6c1603aB6CecF89DD60C24530DdE23F97DA3C229',
  '0x361384A0d755f972E5Eea26e4F4efBAf976B6461',
];

export const MISSING_TOKEN_PRICE_ADDRESSES: Address[] = [
  '0x84631c0d0081FDe56DeB72F6DE77abBbF6A9f93a',
  '0x7a4EffD87C2f3C55CA251080b1343b605f327E3a',
  '0x5fD13359Ba15A84B76f7F87568309040176167cd',
];
