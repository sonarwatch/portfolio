import { Fetcher } from './Fetcher';
import { AirdropFetcher } from './AirdropFetcher';
import { Job } from './Job';
import { getFetchersByAddressSystem } from './utils/misc/getFetchersByAddressSystem';

// PLUGINS
import * as tokens from './plugins/tokens';
import * as nativeStake from './plugins/native-stake';
import * as switchboard from './plugins/switchboard';
import * as marinade from './plugins/marinade';
import * as marginfi from './plugins/marginfi';
import * as saber from './plugins/saber';
import * as save from './plugins/save';
import * as raydium from './plugins/raydium';
import * as orca from './plugins/orca';
import * as meteora from './plugins/meteora';
import * as cetus from './plugins/cetus';
import * as turbos from './plugins/turbos';
import * as thala from './plugins/thala';
import * as tensor from './plugins/tensor';
import * as orders from './plugins/orders';
import * as aave from './plugins/aave';
import * as stakingAptos from './plugins/staking-aptos';
import * as morpho from './plugins/morpho';
import * as drift from './plugins/drift';
import * as mango from './plugins/mango';
import * as topTokens from './plugins/top-tokens';
import * as liquidityPoolsSei from './plugins/liquiditypools-sei';
import * as pancakeswap from './plugins/pancakeswap';
import * as aftermath from './plugins/aftermath';
import * as liquidswap from './plugins/liquidswap';
import * as auxexchange from './plugins/auxexchange';
import * as maker from './plugins/maker';
import * as kamino from './plugins/kamino';
import * as bucket from './plugins/bucket';
import * as navi from './plugins/navi';
import * as scallop from './plugins/scallop';
import * as rocketpool from './plugins/rocket-pool';
import * as lido from './plugins/lido';
import * as curve from './plugins/curve';
import * as compound from './plugins/compound';
import * as stargate from './plugins/stargate';
import * as stader from './plugins/stader';
import * as uniswap from './plugins/uniswap';
import * as balancer from './plugins/balancer';
import * as paraswap from './plugins/paraswap';
import * as hawksight from './plugins/hawksight';
import * as daos from './plugins/daos';
import * as maple from './plugins/maple';
import * as lulo from './plugins/lulo';
import * as fluxbeam from './plugins/fluxbeam';
import * as jupiter from './plugins/jupiter';
import * as zeta from './plugins/zeta';
import * as venus from './plugins/venus';
import * as sushiswap from './plugins/sushiswap';
import * as yearn from './plugins/yearn';
import * as atrix from './plugins/atrix';
import * as zeroOne01 from './plugins/01';
import * as goosefx from './plugins/goosefx';
import * as rain from './plugins/rain';
import * as lifinity from './plugins/lifinity';
import * as port from './plugins/port';
import * as instadapp from './plugins/instadapp';
import * as streamflow from './plugins/streamflow';
import * as benqi from './plugins/benqi';
import * as parcl from './plugins/parcl';
import * as pyth from './plugins/pyth';
import * as driftMM from './plugins/drift-market-maker-vault';
import * as aries from './plugins/aries';
import * as flash from './plugins/flash';
import * as bonkrewards from './plugins/bonkrewards';
import * as accessprotocol from './plugins/accessprotocol';
import * as aptin from './plugins/aptin';
import * as bskt from './plugins/bskt';
import * as genesysgo from './plugins/genesysgo';
import * as aurory from './plugins/aurory';
import * as xStakingSolana from './plugins/x-staking-solana';
import * as splStaking from './plugins/armada-staking';
import * as abex from './plugins/abex';
import * as kai from './plugins/kai';
import * as suilend from './plugins/suilend';
import * as symmetry from './plugins/symmetry';
import * as staratlas from './plugins/staratlas';
import * as tulip from './plugins/tulip';
import * as phoenix from './plugins/phoenix';
import * as uxd from './plugins/uxd';
import * as wormhole from './plugins/wormhole';
import * as banx from './plugins/banx';
import * as nosana from './plugins/nosana';
import * as jito from './plugins/jito';
import * as magiceden from './plugins/magiceden';
import * as clone from './plugins/clone';
import * as sandglass from './plugins/sandglass';
import * as kriya from './plugins/kriya';
import * as haedal from './plugins/haedal';
import * as flowx from './plugins/flowx';
import * as typus from './plugins/typus';
import * as mole from './plugins/mole';
import * as bonfida from './plugins/bonfida';
import * as cropper from './plugins/cropper';
import * as hedgehog from './plugins/hedgehog';
import * as whalesmarket from './plugins/whalesmarket';
import * as futarchy from './plugins/futarchy';
import * as elixir from './plugins/elixir';
import * as moonwalk from './plugins/moonwalk';
import * as bluefin from './plugins/bluefin';
import * as citrus from './plugins/citrus';
import * as sharky from './plugins/sharky';
import * as sanctum from './plugins/sanctum';
import * as allbridge from './plugins/allbridge';
import * as famousfoxfederation from './plugins/famousfoxfederation';
import * as nxfinance from './plugins/nxfinance';
import * as solayer from './plugins/solayer';
import * as picasso from './plugins/picasso';
import * as quarry from './plugins/quarry';
import * as thevault from './plugins/thevault';
import * as deepbook from './plugins/deepbook';
import * as suins from './plugins/suins';
import * as debridge from './plugins/debridge';
import * as alphafi from './plugins/alphafi';
import * as jewel from './plugins/jewel';
import * as tradeport from './plugins/tradeport';
import * as bluemove from './plugins/bluemove';
import * as stabble from './plugins/stabble';
import * as francium from './plugins/francium';
import * as adrastea from './plugins/adrastea';
import * as elemental from './plugins/elemental';
import * as adrena from './plugins/adrena';
import * as joule from './plugins/joule';
import * as meso from './plugins/meso';
import * as loopscale from './plugins/loopscale';
import * as vaultka from './plugins/vaultka';
import * as zelo from './plugins/zelo';
import * as hxro from './plugins/hxro';
import * as spdr from './plugins/spdr';
import * as grass from './plugins/grass';
import * as cyberfrogs from './plugins/cyberfrogs';
import * as metaplex from './plugins/metaplex';
import * as ensofi from './plugins/ensofi';
import * as coinmarketcap from './plugins/coinmarketcap';
import * as doubleup from './plugins/doubleup';
import * as photofinish from './plugins/photofinish';
import * as pudgypenguins from './plugins/pudgypenguins';
import * as gpool from './plugins/gpool';
import * as defiland from './plugins/defiland';
import * as perena from './plugins/perena';
import * as fragmetric from './plugins/fragmetric';
import * as divvy from './plugins/divvy';
import * as exponent from './plugins/exponent';
import * as ratex from './plugins/ratex';
import * as defituna from './plugins/defituna';
import * as iloop from './plugins/iloop';
import * as sonic from './plugins/sonic';
import * as pluto from './plugins/pluto';
import * as layer3 from './plugins/layer3';
import * as puffcoin from './plugins/puffcoin';
import * as triad from './plugins/triad';
import * as baskt from './plugins/baskt';
import * as guano from './plugins/guano';
import * as coingecko from './plugins/coingecko';
import * as zeus from './plugins/zeus';
import * as pumpswap from './plugins/pumpswap';
import * as pumpkin from './plugins/pumpkin';
import * as nirvana from './plugins/nirvana';
import * as runemine from './plugins/runemine';
import * as solanaid from './plugins/solanaid';
import * as texture from './plugins/texture';
import * as hylo from './plugins/hylo';
import * as oresupply from './plugins/oresupply';
import * as bio from './plugins/bio';
import * as huma from './plugins/huma';
import * as honeyland from './plugins/honeyland';
import * as lavarage from './plugins/lavarage';
import * as boop from './plugins/boop';
import * as cytonic from './plugins/cytonic';
import * as bouncebit from './plugins/bouncebit';
import * as haven from './plugins/haven';
import * as pumpfun from './plugins/pumpfun';
import { solanaSimpleFetcher } from './plugins/tokens';

export { getFetchersByAddressSystem } from './utils/misc/getFetchersByAddressSystem';

export * from './Cache';
export * from './Fetcher';
export * from './AirdropFetcher';
export * from './Job';
export * from './utils/name-service';
export * from './utils/hasTransactions';

export { getLlamaProtocolsJob } from './plugins/llama-protocols';
export { jupFetcherIds } from './plugins/jupiter';
export { solanaSimpleFetcher };

const modules = [
  tokens,
  nativeStake,
  switchboard,
  marinade,
  marginfi,
  saber,
  save,
  raydium,
  orca,
  meteora,
  cetus,
  turbos,
  thala,
  tensor,
  orders,
  aave,
  stakingAptos,
  morpho,
  drift,
  mango,
  topTokens,
  liquidityPoolsSei,
  pancakeswap,
  aftermath,
  liquidswap,
  auxexchange,
  maker,
  kamino,
  bucket,
  navi,
  scallop,
  rocketpool,
  lido,
  curve,
  compound,
  stargate,
  stader,
  uniswap,
  balancer,
  paraswap,
  hawksight,
  daos,
  maple,
  lulo,
  fluxbeam,
  jupiter,
  zeta,
  venus,
  sushiswap,
  yearn,
  atrix,
  zeroOne01,
  goosefx,
  rain,
  lifinity,
  port,
  instadapp,
  streamflow,
  benqi,
  parcl,
  pyth,
  driftMM,
  aries,
  flash,
  bonkrewards,
  accessprotocol,
  aptin,
  bskt,
  genesysgo,
  aurory,
  xStakingSolana,
  splStaking,
  abex,
  kai,
  suilend,
  symmetry,
  staratlas,
  tulip,
  phoenix,
  uxd,
  wormhole,
  banx,
  nosana,
  jito,
  magiceden,
  clone,
  sandglass,
  kriya,
  haedal,
  flowx,
  typus,
  mole,
  bonfida,
  cropper,
  hedgehog,
  whalesmarket,
  futarchy,
  elixir,
  moonwalk,
  bluefin,
  citrus,
  sharky,
  sanctum,
  allbridge,
  famousfoxfederation,
  nxfinance,
  solayer,
  picasso,
  quarry,
  thevault,
  deepbook,
  suins,
  debridge,
  alphafi,
  jewel,
  tradeport,
  bluemove,
  stabble,
  francium,
  adrastea,
  elemental,
  adrena,
  joule,
  meso,
  loopscale,
  vaultka,
  zelo,
  hxro,
  spdr,
  grass,
  cyberfrogs,
  metaplex,
  ensofi,
  coinmarketcap,
  doubleup,
  photofinish,
  pudgypenguins,
  gpool,
  defiland,
  perena,
  fragmetric,
  divvy,
  exponent,
  ratex,
  defituna,
  iloop,
  sonic,
  pluto,
  layer3,
  puffcoin,
  triad,
  baskt,
  guano,
  coingecko,
  zeus,
  pumpswap,
  pumpkin,
  nirvana,
  runemine,
  solanaid,
  texture,
  hylo,
  oresupply,
  bio,
  huma,
  honeyland,
  lavarage,
  boop,
  cytonic,
  bouncebit,
  haven,
  pumpfun,
];

// JOBS //
export const jobs: Job[] = modules
  .map((module): Job[] => {
    if ('jobs' in module) {
      return module.jobs as Job[];
    }
    return [];
  })
  .flat();

// FETCHERS //

export const defaultFetchers: Fetcher[] = modules
  .map((module): Fetcher[] => {
    if ('fetchers' in module) {
      return module.fetchers as Fetcher[];
    }
    return [];
  })
  .flat();

/**
 * @deprecated Use `defaultFetchers` instead.
 */
export const fetchers: Fetcher[] = defaultFetchers;
export const allFetchers = [...defaultFetchers, solanaSimpleFetcher];
export const fetchersByAddressSystem =
  getFetchersByAddressSystem(defaultFetchers);
export const allFetchersByAddressSystem =
  getFetchersByAddressSystem(allFetchers);

export const airdropFetchers: AirdropFetcher[] = modules
  .map((module): AirdropFetcher[] => {
    if ('airdropFetchers' in module) {
      return module.airdropFetchers as AirdropFetcher[];
    }
    return [];
  })
  .flat();
export const airdropFetchersByAddressSystem =
  getFetchersByAddressSystem(airdropFetchers);
