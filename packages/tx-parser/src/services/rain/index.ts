import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contractNftLending = {
  name: 'Rain NFT Lending',
  address: 'rNfTQD84kwMbcRpWpLR92BVmxbuwrZc3o5HTauAZiXs',
  platformId: 'rain',
};

const contractDefiLending = {
  name: 'Rain Defi Lending',
  address: 'rDeFiHPjHZRLiz4iBzMw3zv6unZs4VwdU6qQcVd3NSK',
  platformId: 'rain',
};

const contractBank = {
  name: 'Rain Vaults',
  address: 'rain2M5b9GeFCk792swkwUu51ZihHJb3SUQ8uHxSRJf',
  platformId: 'rain',
};

const defiService: Service = {
  id: 'rain-defi-lending',
  name: 'Rain Defi Lending',
  platformId: 'rain',
  networkId: NetworkId.solana,
  contracts: [contractDefiLending],
};

const nftService: Service = {
  id: 'rain-nft-lending',
  name: 'Rain NFT Lending',
  platformId: 'rain',
  networkId: NetworkId.solana,
  contracts: [contractNftLending],
};

const vaultsService: Service = {
  id: 'rain-vaults',
  name: 'Rain Vaults',
  platformId: 'rain',
  networkId: NetworkId.solana,
  contracts: [contractBank],
};

export const services: Service[] = [defiService, nftService, vaultsService];
export default services;
