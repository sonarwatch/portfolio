import { allNameChecker } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../clients';
import { NameService } from '../types';
import { TldParser } from '@onsol/tldparser';

async function getOwner(name: string): Promise<string | null> {
  const client = getClientSolana();
  const parser = new TldParser(client);
  const owner = await parser.getOwnerFromDomainTld(name)
  if (owner) return owner.toString();
  return null;
}

async function getNames(address: string): Promise<string[]> {
  const client = getClientSolana();
  
  const parser = new TldParser(client);
  const mainDomain = await parser.getMainDomain(address).catch(()=> undefined)
  if (!mainDomain) return [];
  return [`${mainDomain.domain}${mainDomain.tld}`];
}

export const nameService: NameService = {
  id: 'allDomains',
  checker: allNameChecker,
  getNames,
  getOwner,
};
