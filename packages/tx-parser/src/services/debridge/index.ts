import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

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

const transferService: ServiceDefinition = {
  id: `${platformId}-transfer`,
  name: 'Transfer',
  platformId,
  networkId: NetworkId.solana,
  contracts: [transferContract],
};

const vaultService: ServiceDefinition = {
  id: 'debridge-vault',
  name: 'Vault',
  platformId: 'debridge',
  networkId: NetworkId.solana,
  contracts: [vaultContract],
};

const airdropService: ServiceDefinition = {
  id: 'debridge-airdrop',
  name: 'Airdrop',
  platformId: 'debridge',
  networkId: NetworkId.solana,
  contracts: [aidropContract],
};

export const services: ServiceDefinition[] = [
  airdropService,
  vaultService,
  transferService,
];
export default services;
