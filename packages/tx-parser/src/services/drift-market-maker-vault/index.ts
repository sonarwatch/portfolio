import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const driftVaultsContract: Contract = {
  name: 'Drift Vaults',
  address: 'vAuLTsyrvSfZRuRB3XgvkPwNGgYSs9YRYymVebLKoxR',
  platformId: 'drift',
};
const neutral1VaultsContract: Contract = {
  name: 'Neutral Vaults',
  address: '9Fcn3Fd4d5ocrb12xCUtEvezxcjFEAyHBPfrZDiPt9Qj',
  platformId: 'neutral',
};
const neutral2VaultsContract: Contract = {
  name: 'Neutral Vaults',
  address: '9Fcn3Fd4d5ocrb12xCUtEvezxcjFEAyHBPfrZDiPt9Qj',
  platformId: 'neutral',
};
const neutral3VaultsContract: Contract = {
  name: 'Neutral Vaults',
  address: '9Fcn3Fd4d5ocrb12xCUtEvezxcjFEAyHBPfrZDiPt9Qj',
  platformId: 'neutral',
};
const nxfinanceVaultsContract: Contract = {
  name: 'NX Finance Vaults',
  address: 'HYHnL9BB3tqSPxkVbdcAn9CAa4hyqNYUh1FwDc4he7aD',
  platformId: 'nxfinance',
};
const vectisVaultsContract: Contract = {
  name: 'Vectis Vaults',
  address: 'EDnxACbdY1GeXnadh5gRuCJnivP7oQSAHGGAHCma4VzG',
  platformId: 'vectis',
};

export const services: ServiceDefinition[] = [
  {
    id: `drift-vaults`,
    name: 'Vault',
    platformId: 'drift',
    networkId: NetworkId.solana,
    contracts: [driftVaultsContract],
  },
  {
    id: `neutral-vaults-1`,
    name: 'Vault',
    platformId: 'neutral',
    networkId: NetworkId.solana,
    contracts: [neutral1VaultsContract],
  },
  {
    id: `neutral-vaults-2`,
    name: 'Vault',
    platformId: 'neutral',
    networkId: NetworkId.solana,
    contracts: [neutral2VaultsContract],
  },
  {
    id: `neutral-vaults-3`,
    name: 'Vault',
    platformId: 'neutral',
    networkId: NetworkId.solana,
    contracts: [neutral3VaultsContract],
  },
  {
    id: `nxfinance-vaults`,
    name: 'Vault',
    platformId: 'nxfinance',
    networkId: NetworkId.solana,
    contracts: [nxfinanceVaultsContract],
  },
  {
    id: `vectis-vaults`,
    name: 'Vault',
    platformId: 'vectis',
    networkId: NetworkId.solana,
    contracts: [vectisVaultsContract],
  },
];

export default services;
