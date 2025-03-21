import { Service } from '@sonarwatch/portfolio-core';
import * as banx from './services/banx';
import * as bskt from './services/bskt';
import * as defituna from './services/defituna';
import * as divvy from './services/divvy';
import * as drift from './services/drift';
import * as driftMMV from './services/drift-market-maker-vault';
import * as elemental from './services/elemental';
import * as ensofi from './services/ensofi';
import * as jupiter from './services/jupiter';
import * as kamino from './services/kamino';
import * as meteora from './services/meteora';
import * as orca from './services/orca';
import * as picasso from './services/picasso';
import * as ratex from './services/ratex';
import * as raydium from './services/raydium';
import * as sharky from './services/sharky';
import * as zeta from './services/zeta';

export const services: Service[] = [
  banx,
  bskt,
  defituna,
  divvy,
  drift,
  driftMMV,
  elemental,
  ensofi,
  jupiter,
  kamino,
  meteora,
  orca,
  picasso,
  ratex,
  raydium,
  sharky,
  zeta,
]
  .map((m) => m.default)
  .flat();

export const sortedServices = services.sort(
  (a, b) => (b.contracts?.length || 0) - (a.contracts?.length || 0)
);
