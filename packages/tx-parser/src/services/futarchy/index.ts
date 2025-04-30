import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'futarchy';
const contract = {
  name: 'Futarchy DAO',
  address: 'autoQP9RmUNkzzKRXsMkWicDVZ3h29vvyMDcAYjCxxg',
  platformId,
};

const launchpadContract = {
  name: 'Launchpad',
  address: 'AfJJJ5UqxhBKoE3grkKAZZsoXDE9kncbMKvqSHGsCNrE',
  platformId,
};

const conditionalContract = {
  name: 'Conditional Vault',
  address: 'VLTX1ishMBbcX3rdBWGssxawAo1Q2X2qxYFYqiGodVg',
  platformId,
};

const ammContract = {
  name: 'AMM',
  address: 'AMMyu265tkBpRW21iGQxKGLaves3gKm2JcMUqfXNSpqD',
  platformId,
};

const service: ServiceDefinition = {
  id: 'futarchy-dao',
  name: 'Decision Market',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    tx.transaction.message.instructions.some((ix) =>
      [
        ammContract.address,
        conditionalContract.address,
        contract.address,
      ].includes(ix.programId.toString())
    ),
};
const launchpadService: ServiceDefinition = {
  id: 'futarchy-launchpad',
  name: 'Launchpad',
  platformId,
  networkId: NetworkId.solana,
  contracts: [launchpadContract],
};

export const services: ServiceDefinition[] = [service, launchpadService];
export default services;
