import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'mango';

const marketsContract = {
  name: 'Markets',
  address: '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg',
  platformId,
};

const redeemContract = {
  name: 'Redeem',
  address: 'mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68',
  platformId,
};

const boostContract = {
  name: 'Boost',
  address: 'zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25',
  platformId,
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-markets`,
  name: 'Markets V4',
  platformId,
  networkId: NetworkId.solana,
  contracts: [marketsContract],
};

const redeemService: ServiceDefinition = {
  id: `${platformId}-redeem`,
  name: 'Markets & Redeem V3',
  platformId,
  networkId: NetworkId.solana,
  contracts: [redeemContract],
};

const boostService: ServiceDefinition = {
  id: `${platformId}-boost`,
  name: 'Boost',
  platformId,
  networkId: NetworkId.solana,
  contracts: [boostContract],
};

export const services: ServiceDefinition[] = [
  airdropService,
  redeemService,
  boostService,
];
export default services;
