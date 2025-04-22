import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'debridge';

const transferContract = {
  name: 'DeBridge',
  address: 'DEbrdGj3HsRsAzx6uH4MKyREKxVAfBydijLUF3ygsFfh',
  platformId,
};

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

const transferService: Service = {
  id: `${platformId}-transfer`,
  name: 'Transfer',
  platformId,
  networkId: NetworkId.solana,
  contracts: [transferContract],
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

export const services: Service[] = [
  airdropService,
  vaultService,
  transferService,
];
export default services;
