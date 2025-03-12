import { Platform } from '@sonarwatch/portfolio-core';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { StableIdl } from './stableIdl';
import { WeightedIdl } from './weightedIdl';

export const platformId = 'stabble';
export const platform: Platform = {
  id: platformId,
  name: 'stabble',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/stabble.webp',
  website: 'https://app.stabble.org/',
  twitter: 'https://x.com/stabbleorg',
  defiLlamaId: 'stabble',
  telegram: 'https://t.me/+XWwNwDja8Oo4M2Y8',
  documentation: 'https://docs.stabble.org/',
  discord: 'https://discord.com/invite/SfkybtttdC',
  github: 'https://github.com/stabbleorg',
  tokens: ['STBuyENwJ1GP4yNZCjwavn92wYLEY3t5S1kVS5kwyS1'],
  description: "Solana's first frictionless liquidity and trading layer",
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
