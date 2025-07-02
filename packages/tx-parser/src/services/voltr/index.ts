import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'voltr';

const mainContract = {
  name: 'Vault',
  address: 'vVoLTRjQmtFpiYoegx285Ze4gsLJ8ZxgFKVcuvmG1a8',
  platformId,
  networkId: NetworkId.solana,
};

const vaultService: ServiceDefinition = {
  id: `${platformId}-vaults`,
  name: 'Vaults',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

export const services: ServiceDefinition[] = [vaultService];
export default services;
