import { Service } from '@sonarwatch/portfolio-core';
import * as adrena from './services/adrena';
import * as allbridge from './services/allbridge';
import * as armada from './services/armada';
import * as atrix from './services/atrix';
import * as aurory from './services/aurory';
import * as banx from './services/banx';
import * as bio from './services/bio';
import * as bonkrewards from './services/bonkrewards';
import * as bskt from './services/bskt';
import * as carrot from './services/carrot';
import * as circle from './services/circle';
import * as citrus from './services/citrus';
import * as debridge from './services/debridge';
import * as defiland from './services/defiland';
import * as defituna from './services/defituna';
import * as dflow from './services/dflow';
import * as divvy from './services/divvy';
import * as drift from './services/drift';
import * as driftMMV from './services/drift-market-maker-vault';
import * as dumpy from './services/dumpy';
import * as elemental from './services/elemental';
import * as ensofi from './services/ensofi';
import * as exponent from './services/exponent';
import * as famousfoxfederation from './services/famousfoxfederation';
import * as flash from './services/flash';
import * as fluxbeam from './services/fluxbeam';
import * as fragmetric from './services/fragmetric';
import * as francium from './services/francium';
import * as futarchy from './services/futarchy';
import * as goosefx from './services/goosefx';
import * as gpool from './services/oresupply';
import * as grass from './services/grass';
import * as guano from './services/guano';
import * as helium from './services/helium';
import * as huma from './services/huma';
import * as hxro from './services/hxro';
import * as hylo from './services/hylo';
import * as iloop from './services/iloop';
import * as jupiter from './services/jupiter';
import * as layer3 from './services/layer3';
import * as kamino from './services/kamino';
import * as lifinity from './services/lifinity';
import * as loopscale from './services/loopscale';
import * as lulo from './services/lulo';
import * as magiceden from './services/magiceden';
import * as marginfi from './services/marginfi';
import * as metaplex from './services/metaplex';
import * as magma from './services/magma';
import * as meteora from './services/meteora';
import * as nirvana from './services/nirvana';
import * as nxfinance from './services/nxfinance';
import * as okx from './services/okx';
import * as orca from './services/orca';
import * as orderly from './services/orderly';
import * as parcl from './services/parcl';
import * as pengu from './services/pengu';
import * as perena from './services/perena';
import * as phoenix from './services/phoenix';
import * as picasso from './services/picasso';
import * as pluto from './services/pluto';
import * as pumpkin from './services/pumpkin';
import * as pumpswap from './services/pumpswap';
import * as pyth from './services/pyth';
import * as quarry from './services/quarry';
import * as rain from './services/rain';
import * as ratex from './services/ratex';
import * as raydium from './services/raydium';
import * as runemine from './services/runemine';
import * as sanctum from './services/sanctum';
import * as save from './services/save';
import * as sharky from './services/sharky';
import * as sns from './services/sns';
import * as solanaid from './services/solanaid';
import * as solayer from './services/solayer';
import * as sonic from './services/sonic';
import * as spiderswap from './services/spiderswap';
import * as stabble from './services/stabble';
import * as staratlas from './services/staratlas';
import * as streamflow from './services/streamflow';
import * as switchboard from './services/switchboard';
import * as symmetry from './services/symmetry';
import * as tensor from './services/tensor';
import * as texture from './services/texture';
import * as triad from './services/triad';
import * as vaultka from './services/vaultka';
import * as wormhole from './services/wormhole';
import * as zeta from './services/zeta';

export const services: Service[] = [
  adrena,
  allbridge,
  armada,
  atrix,
  aurory,
  banx,
  bio,
  bonkrewards,
  bskt,
  carrot,
  circle,
  citrus,
  debridge,
  defiland,
  defituna,
  dflow,
  divvy,
  drift,
  driftMMV,
  dumpy,
  elemental,
  ensofi,
  exponent,
  famousfoxfederation,
  flash,
  fluxbeam,
  fragmetric,
  francium,
  futarchy,
  goosefx,
  gpool,
  grass,
  guano,
  helium,
  huma,
  hxro,
  hylo,
  iloop,
  jupiter,
  kamino,
  layer3,
  lifinity,
  loopscale,
  lulo,
  magiceden,
  marginfi,
  metaplex,
  magma,
  meteora,
  nirvana,
  nxfinance,
  okx,
  orca,
  orderly,
  parcl,
  pengu,
  perena,
  phoenix,
  picasso,
  pluto,
  pumpkin,
  pumpswap,
  pyth,
  quarry,
  rain,
  ratex,
  raydium,
  runemine,
  sanctum,
  save,
  sharky,
  sns,
  solanaid,
  solayer,
  sonic,
  spiderswap,
  stabble,
  staratlas,
  streamflow,
  switchboard,
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
