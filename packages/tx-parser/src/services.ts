import { Service } from '@sonarwatch/portfolio-core';
import * as banx from './services/banx';
import * as defituna from './services/defituna';
import * as drift from './services/drift';
import * as driftMMV from './services/drift-market-maker-vault';
import * as jupiter from './services/jupiter';
import * as kamino from './services/kamino';
import * as meteora from './services/meteora';
import * as orca from './services/orca';
import * as raydium from './services/raydium';

export const services: Service[] = [
  banx,
  defituna,
  drift,
  driftMMV,
  jupiter,
  kamino,
  meteora,
  orca,
  raydium,
]
  .map((m) => m.default)
  .flat();

export const sortedServices = services.sort(
  (a, b) => (b.contracts?.length || 0) - (a.contracts?.length || 0)
);
