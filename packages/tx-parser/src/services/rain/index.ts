import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'rain';
const contractNftLending = {
  name: 'NFT Lending',
  address: 'rNfTQD84kwMbcRpWpLR92BVmxbuwrZc3o5HTauAZiXs',
  platformId,
};

const contractDefiLending = {
  name: 'Defi Lending',
  address: 'rDeFiHPjHZRLiz4iBzMw3zv6unZs4VwdU6qQcVd3NSK',
  platformId,
};

const contractBank = {
  name: 'Vaults',
  address: 'rain2M5b9GeFCk792swkwUu51ZihHJb3SUQ8uHxSRJf',
  platformId,
};

const liquidContract = {
  name: 'Liquid',
  address: 'wJUPXhGwC88LZeG1DXaYing3WB1Q4YvwJcK77bidNGv',
  platformId,
};

const defiService: Service = {
  id: 'rain-defi-lending',
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contractDefiLending],
};

const nftService: Service = {
  id: 'rain-nft-lending',
  name: 'NFT Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contractNftLending],
};

const vaultsService: Service = {
  id: 'rain-vaults',
  name: 'Vaults',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contractBank],
};

const liquidService: Service = {
  id: 'rain-vaults',
  name: 'Liquid',
  platformId,
  networkId: NetworkId.solana,
  contracts: [liquidContract],
};

export const services: Service[] = [
  defiService,
  nftService,
  vaultsService,
  liquidService,
];
export default services;
