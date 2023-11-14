import { NameService } from './types';
import { nameService as bonfidaNameService } from './services/bonfida';
import { nameService as avalancheNameService } from './services/avalanche';
import { nameService as ensNameService } from './services/ens';
import { nameService as allDomainsNameService } from './services/allDomains';

export const nameServices: NameService[] = [
  bonfidaNameService,
  avalancheNameService,
  ensNameService,
  // Please leave allDomainsNameService at the end.
  allDomainsNameService,
];
