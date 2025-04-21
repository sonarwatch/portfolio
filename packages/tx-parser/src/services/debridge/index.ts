import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const aidropContract = {
  name: 'Airdrop',
  address: 'DBrLFG4dco1xNC5Aarbt3KEaKaJ5rBYHwysqZoeqsSFE',
  platformId: 'debridge',
};

const vaultContract = {
  name: 'Vault',
  address: 'DeDRoPXNyHRJSagxZBBqs4hLAAM1bGKgxh7cyfuNCBpo',
  platformId: 'debridge',
};

const vaultService: Service = {
  id: 'debridge-vault',
  name: 'Vault',
  platformId: 'debridge',
  networkId: NetworkId.solana,
  contracts: [vaultContract],
};

const airdropService: Service = {
  id: 'debridge-airdrop',
  name: 'Airdrop',
  platformId: 'debridge',
  networkId: NetworkId.solana,
  contracts: [aidropContract],
};

export const services: Service[] = [airdropService, vaultService];
export default services;
