import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const banxContract = {
  name: 'Banx Bonds',
  address: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
  platformId: 'banx',
};

const banxVaultsContract = {
  name: 'Vaults',
  address: 'BanxxEcFZPJLKhS59EkwTa8SZez8vDYTiJVN78mGHWDi',
  platformId: 'banx',
};

const bondsService: ServiceDefinition = {
  id: 'banx-bonds',
  name: 'Bonds',
  platformId: 'banx',
  networkId: NetworkId.solana,
  contracts: [banxContract],
};

const vaultsService: ServiceDefinition = {
  id: 'banx-vaults',
  name: 'Vaults',
  platformId: 'banx',
  networkId: NetworkId.solana,
  contracts: [banxVaultsContract, banxContract],
};

export const services: ServiceDefinition[] = [bondsService, vaultsService];
export default services;
