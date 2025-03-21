import { Service } from '@sonarwatch/portfolio-core';
import * as banx from './services/banx';
import * as bskt from './services/bskt';
import * as defituna from './services/defituna';
import * as drift from './services/drift';
import * as driftMMV from './services/drift-market-maker-vault';
import * as jupiter from './services/jupiter';
import * as kamino from './services/kamino';
import * as meteora from './services/meteora';
import * as orca from './services/orca';
import * as ratex from './services/ratex';
import * as raydium from './services/raydium';
import * as zeta from './services/zeta';

export const services: Service[] = [
  banx,
  bskt,
  defituna,
  drift,
  driftMMV,
  jupiter,
  kamino,
  meteora,
  orca,
  ratex,
  raydium,
  zeta,
]
  .map((m) => m.default)
  .flat();

export const sortedServices = services.sort(
  (a, b) => (b.contracts?.length || 0) - (a.contracts?.length || 0)
);
