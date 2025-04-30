import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'raydium';

const ammV3Contract: Contract = {
  name: 'AMM v3',
  address: 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q',
  platformId,
};
const ammV4Contract: Contract = {
  name: 'AMM v4',
  address: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  platformId,
};
const ammV5Contract: Contract = {
  name: 'AMM v5',
  address: '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h',
  platformId,
};
const ammRootingContract: Contract = {
  name: 'AMM Rooting',
  address: 'routeUGWgWzqBWFcrCfv8tritsqukccJPu3q5GPP3xS',
  platformId,
};
const clmmContract: Contract = {
  name: 'CLMM',
  address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
  platformId,
};
const cpmmContract: Contract = {
  name: 'CPMM',
  address: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
  platformId,
};
const farmV3Contract: Contract = {
  name: 'Farm V3',
  address: 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q',
  platformId,
};
const farmV4Contract: Contract = {
  name: 'Farm V4',
  address: 'CBuCnLe26faBpcBP2fktp4rp8abpcAnTWft6ZrP5Q4T',
  platformId,
};
const farmV5Contract: Contract = {
  name: 'Farm V5',
  address: '9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z',
  platformId,
};
const farmV6Contract: Contract = {
  name: 'Farm V6',
  address: 'FarmqiPv5eAj3j1GMdMCMUGXqPUvmquZtMy86QH6rzhG',
  platformId,
};
const idoContract: Contract = {
  name: 'IDO V1',
  address: '6FJon3QE27qgPVggARueB22hLvoh22VzJpXv4rBEoSLF',
  platformId,
};
const idoV2Contract: Contract = {
  name: 'IDO V2',
  address: 'CC12se5To1CdEuw7fDS27B7Geo5jJyL7t5UK2B44NgiH',
  platformId,
};
const idoV3Contract: Contract = {
  name: 'IDO V3',
  address: '9HzJyW1qZsEiSfMUf6L2jo3CcTKAyBmSyKdwQeYisHrC',
  platformId,
};
const idoV4Contract: Contract = {
  name: 'IDO V4',
  address: 'DropEU8AvevN3UrXWXTMuz3rqnMczQVNjq3kcSdW2SQi',
  platformId,
};
const launchpadContract: Contract = {
  name: 'Launchpad',
  address: 'LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-amm-v3`,
    name: 'Stake',
    platformId,
    networkId: NetworkId.solana,
    contracts: [ammV3Contract],
  },
  {
    id: `${platformId}-amm-v4`,
    name: 'AMM v4',
    platformId,
    networkId: NetworkId.solana,
    contracts: [ammV4Contract],
  },
  {
    id: `${platformId}-amm-v5`,
    name: 'AMM v5',
    platformId,
    networkId: NetworkId.solana,
    contracts: [ammV5Contract],
  },
  {
    id: `${platformId}-amm-rooting`,
    name: 'Swap',
    platformId,
    networkId: NetworkId.solana,
    contracts: [ammRootingContract],
  },
  {
    id: `${platformId}-clmm`,
    name: 'CLMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [clmmContract],
  },
  {
    id: `${platformId}-cpmm`,
    name: 'CPMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [cpmmContract],
  },
  {
    id: `${platformId}-farm-v3`,
    name: 'Stake',
    platformId,
    networkId: NetworkId.solana,
    contracts: [farmV3Contract],
  },
  {
    id: `${platformId}-farm-v4`,
    name: 'Farm V4',
    platformId,
    networkId: NetworkId.solana,
    contracts: [farmV4Contract],
  },
  {
    id: `${platformId}-farm-v5`,
    name: 'Farm V5',
    platformId,
    networkId: NetworkId.solana,
    contracts: [farmV5Contract],
  },
  {
    id: `${platformId}-farm-v6`,
    name: 'Farm V6',
    platformId,
    networkId: NetworkId.solana,
    contracts: [farmV6Contract],
  },
  {
    id: `${platformId}-ido-v1`,
    name: 'IDO V1',
    platformId,
    networkId: NetworkId.solana,
    contracts: [idoContract],
  },
  {
    id: `${platformId}-ido-v2`,
    name: 'IDO V2',
    platformId,
    networkId: NetworkId.solana,
    contracts: [idoV2Contract],
  },
  {
    id: `${platformId}-ido-v3`,
    name: 'IDO V3',
    platformId,
    networkId: NetworkId.solana,
    contracts: [idoV3Contract],
  },
  {
    id: `${platformId}-ido-v4`,
    name: 'IDO V4',
    platformId,
    networkId: NetworkId.solana,
    contracts: [idoV4Contract],
  },
  {
    id: `${platformId}-launchpad`,
    name: 'Launchpad',
    platformId,
    networkId: NetworkId.solana,
    contracts: [launchpadContract],
  },
];

export default services;
