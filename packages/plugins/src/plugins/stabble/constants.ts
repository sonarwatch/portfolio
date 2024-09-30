import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { StableIdl } from './stableIdl';
import { WeightedIdl } from './weightedIdl';

export const platformId = 'stabble';
export const platform: Platform = {
  id: platformId,
  name: 'Stabble',
  image: 'https://sonar.watch/img/platforms/stabble.webp',
  website: 'https://app.stabble.org/',
  twitter: 'https://x.com/stabbleorg',
  defiLlamaId: 'stabble',
};

export const stableProgramId = 'swapNyd8XiQwJ6ianp9snpu4brUqFxadzvHebnAXjJZ';

export const stableIdlItem = {
  programId: stableProgramId,
  idl: StableIdl,
  idlType: 'anchor',
} as IdlItem;

export const weightedProgramId = 'swapFpHZwjELNnjvThjajtiVmkz3yPQEHjLtka2fwHW';

export const weightedIdlItem = {
  programId: weightedProgramId,
  idl: WeightedIdl,
  idlType: 'anchor',
} as IdlItem;
