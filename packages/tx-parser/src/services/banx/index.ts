import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const banxContract = {
  name: 'Banx',
  address: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
  platformId: 'banx',
};

const banxVaultsContract = {
  name: 'Banx Vaults',
  address: 'BanxxEcFZPJLKhS59EkwTa8SZez8vDYTiJVN78mGHWDi',
  platformId: 'banx',
};

export const banxService: Service = {
  id: 'banx',
  name: 'Banx',
  platformId: 'banx',
  networkId: NetworkId.solana,
  contracts: [banxContract],
};

export const banxVaultsService: Service = {
  id: 'banx',
  name: 'Banx Vaults',
  platformId: 'banx',
  networkId: NetworkId.solana,
  contracts: [banxVaultsContract, banxContract],
};

export const services: Service[] = [banxService, banxVaultsService];
export default services;
