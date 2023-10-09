import { NameChecker } from '@sonarwatch/portfolio-core';

export type NameService = {
  id: string;
  checker: NameChecker;
  getOwner: (name: string) => Promise<string | null>;
  getNames: (address: string) => Promise<string[]>;
};
