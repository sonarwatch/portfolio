import { aptosNameChecker } from '@sonarwatch/portfolio-core';
import { NameService } from '../types';
import { getClientAptos } from '../../clients';

async function getOwner(name: string): Promise<string | null> {
  const res = await getClientAptos().getName({ name: name.toLowerCase() });
  if (!res?.owner_address) return null;

  return res.owner_address;
}

async function getNames(address: string): Promise<string[]> {
  const res = await getClientAptos().getAccountNames({
    accountAddress: address,
  });

  if (res.length === 0) return [];
  return res.map((el) => (el.domain ? `${el.domain}.apt` : [])).flat();
}

export const nameService: NameService = {
  id: 'aptos',
  checker: aptosNameChecker,
  getNames,
  getOwner,
};
