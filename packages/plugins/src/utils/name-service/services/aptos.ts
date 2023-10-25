import { aptosNameChecker } from '@sonarwatch/portfolio-core';
import { NameService } from '../types';

async function getOwner(name: string): Promise<string | null> {
  const response = await fetch(
    `https://www.aptosnames.com/api/mainnet/v1/address/${name}`
  );
  const { address } = await response.json();
  if (!address) return null;
  return address;
}

async function getNames(address: string): Promise<string[]> {
  const response = await fetch(
    `https://www.aptosnames.com/api/mainnet/v1/primary-name/${address}`
  );
  const { name } = await response.json();
  if (!name) return [];
  return [`${name}.apt`];
}

export const nameService: NameService = {
  id: 'aptos',
  checker: aptosNameChecker,
  getNames,
  getOwner,
};
