import { Service } from '@sonarwatch/portfolio-core';
import * as armada from './services/armada';
import * as atrix from './services/atrix';
import * as aurory from './services/aurory';
import * as banx from './services/banx';
import * as bonkrewards from './services/bonkrewards';
import * as bskt from './services/bskt';
import * as debridge from './services/debridge';
import * as defiland from './services/defiland';
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
import * as futarchy from './services/futarchy';
import * as gpool from './services/gpool';
import * as grass from './services/grass';
import * as helium from './services/helium';
import * as hxro from './services/hxro';
import * as hylo from './services/hylo';
import * as jupiter from './services/jupiter';
import * as kamino from './services/kamino';
import * as lifinity from './services/lifinity';
import * as loopscale from './services/loopscale';
import * as lulo from './services/lulo';
import * as marginfi from './services/marginfi';
import * as magma from './services/magma';
import * as meteora from './services/meteora';
import * as nirvana from './services/nirvana';
import * as nxfinance from './services/nxfinance';
import * as orca from './services/orca';
import * as parcl from './services/parcl';
import * as perena from './services/perena';
import * as picasso from './services/picasso';
import * as pluto from './services/pluto';
import * as pumpswap from './services/pumpswap';
import * as pumpkin from './services/pumpkin';
import * as quarry from './services/quarry';
import * as rain from './services/rain';
import * as ratex from './services/ratex';
import * as raydium from './services/raydium';
import * as runemine from './services/runemine';
import * as sanctum from './services/sanctum';
import * as save from './services/save';
import * as sharky from './services/sharky';
import * as solanaid from './services/solanaid';
import * as sonic from './services/sonic';
import * as spiderswap from './services/spiderswap';
import * as stabble from './services/stabble';
import * as staratlas from './services/staratlas';
import * as streamflow from './services/streamflow';
import * as symmetry from './services/symmetry';
import * as tensor from './services/tensor';
import * as texture from './services/texture';
import * as triad from './services/triad';
import * as vaultka from './services/vaultka';
import * as wormhole from './services/wormhole';
import * as zeta from './services/zeta';

export const services: Service[] = [
  armada,
  atrix,
  aurory,
  banx,
  banx,
  bonkrewards,
  bskt,
  debridge,
  defiland,
  defituna,
  divvy,
  drift,
  driftMMV,
  elemental,
  ensofi,
  ensofi,
  exponent,
  flash,
  fragmetric,
  francium,
  futarchy,
  gpool,
  grass,
  helium,
  hxro,
  hylo,
  jupiter,
  kamino,
  lifinity,
  loopscale,
  lulo,
  marginfi,
  magma,
  meteora,
  nirvana,
  nxfinance,
  orca,
  parcl,
  perena,
  picasso,
  pluto,
  pumpswap,
  pumpkin,
  quarry,
  rain,
  ratex,
  raydium,
  runemine,
  sanctum,
  save,
  sharky,
  solanaid,
  sonic,
  spiderswap,
  stabble,
  staratlas,
  streamflow,
  symmetry,
  tensor,
  texture,
  triad,
  vaultka,
  wormhole,
  zeta,
]
  .map((m) => m.default)
  .flat();

export const sortedServices = services.sort(
  (a, b) => (b.contracts?.length || 0) - (a.contracts?.length || 0)
);
