import { suiNameChecker } from '@sonarwatch/portfolio-core';
import { NameService } from '../types';
import { getClientSui } from '../../clients';

async function getOwner(name: string): Promise<string | null> {
  return getClientSui().resolveNameServiceAddress({ name: name.toLowerCase() });
}

async function getNames(address: string): Promise<string[]> {
  return getClientSui()
    .resolveNameServiceNames({ address })
    .then((res) => res.data);
}

export const nameService: NameService = {
  id: 'sui',
  checker: suiNameChecker,
  getNames,
  getOwner,
};
