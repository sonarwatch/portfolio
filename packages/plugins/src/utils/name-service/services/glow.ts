/* eslint-disable @typescript-eslint/no-unused-vars */
import { glowNameChecker } from '@sonarwatch/portfolio-core';
import { NameService } from '../types';

async function getOwner(name: string): Promise<string | null> {
  return null;
}

async function getNames(address: string): Promise<string[]> {
  return [`toto.glow`];
}

export const nameService: NameService = {
  id: 'glow',
  checker: glowNameChecker,
  getNames,
  getOwner,
};
