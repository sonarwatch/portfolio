import { Service } from '@sonarwatch/portfolio-core';
import * as banx from './services/banx';
import * as bskt from './services/bskt';
import * as defituna from './services/defituna';
import * as divvy from './services/divvy';
import * as drift from './services/drift';
import * as driftMMV from './services/drift-market-maker-vault';
import * as elemental from './services/elemental';
import * as ensofi from './services/ensofi';
import * as exponent from './services/exponent';
import * as flash from './services/flash';
import * as fragmetric from './services/fragmetric';
import * as francium from './services/francium';
import * as jupiter from './services/jupiter';
import * as kamino from './services/kamino';
import * as loopscale from './services/loopscale';
import * as lulo from './services/lulo';
import * as marginfi from './services/marginfi';
import * as meteora from './services/meteora';
import * as orca from './services/orca';
import * as parcl from './services/parcl';
import * as perena from './services/perena';
import * as picasso from './services/picasso';
import * as pumpswap from './services/pumpswap';
import * as rain from './services/rain';
import * as ratex from './services/ratex';
import * as raydium from './services/raydium';
import * as save from './services/save';
import * as sharky from './services/sharky';
import * as symmetry from './services/symmetry';
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
  exponent,
  flash,
  fragmetric,
  francium,
  jupiter,
  kamino,
  loopscale,
  lulo,
  marginfi,
  meteora,
  orca,
  parcl,
  perena,
  picasso,
  pumpswap,
  rain,
  ratex,
  raydium,
  save,
  sharky,
  symmetry,
  zeta,
]
  .map((m) => m.default)
  .flat();

export const sortedServices = services.sort(
  (a, b) => (b.contracts?.length || 0) - (a.contracts?.length || 0)
);
