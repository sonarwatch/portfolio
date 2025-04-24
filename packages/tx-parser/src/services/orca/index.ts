import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'orca';

const poolsContract: Contract = {
  name: `Orca Pools`,
  address: '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP',
  platformId,
};
const aquaFarmsContract: Contract = {
  name: `Orca Aqua Farms`,
  address: '82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ',
  platformId,
};
const whirlpoolContract: Contract = {
  name: `Orca Whirlpool`,
  address: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-pools`,
    name: 'Pools',
    platformId,
    networkId: NetworkId.solana,
    contracts: [poolsContract],
  },
  {
    id: `${platformId}-farms`,
    name: 'Aqua Farms',
    platformId,
    networkId: NetworkId.solana,
    contracts: [aquaFarmsContract],
  },
  {
    id: `${platformId}-whirlpools`,
    name: 'Whirlpools',
    platformId,
    networkId: NetworkId.solana,
    contracts: [whirlpoolContract],
  },
];
export default services;
