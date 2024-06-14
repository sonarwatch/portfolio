import { NameService } from './types';
import { nameService as bonfidaNameService } from './services/bonfida';
import { nameService as avalancheNameService } from './services/avalanche';
import { nameService as ensNameService } from './services/ens';
import { nameService as suiNameService } from './services/sui';
import { nameService as aptosNameService } from './services/aptos';
import { nameService as allDomainsNameService } from './services/allDomains';

export const nameServices: NameService[] = [
  bonfidaNameService,
  avalancheNameService,
  ensNameService,
  suiNameService,
  aptosNameService,
  // Please leave allDomainsNameService at the end.
  allDomainsNameService,
];
