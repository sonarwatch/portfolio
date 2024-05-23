import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from './Fetcher';
import { AirdropFetcher } from './AirdropFetcher';
import { Job } from './Job';
import { getFetchersByAddressSystem } from './utils/misc/getFetchersByAddressSystem';
import orphanPlatorms from './orphanPlatorms';
import {
  platforms as tokensPlatforms,
  jobs as tokensJobs,
  fetchers as tokensFetchers,
} from './plugins/tokens';
import {
  platforms as nativeStakePlatforms,
  fetchers as nativeStakeFetchers,
  jobs as nativeStakeJobs,
} from './plugins/native-stake';
import { jobs as switchboardJobs } from './plugins/switchboard';
import {
  platforms as marinadePlatforms,
  fetchers as marinadeFetchers,
} from './plugins/marinade';
import {
  platforms as marginfiPlatforms,
  jobs as marginfiJobs,
  fetchers as marginfiFetchers,
} from './plugins/marginfi';
import {
  platforms as saberPlatforms,
  jobs as saberJobs,
} from './plugins/saber';
import {
  platforms as solendPlatforms,
  jobs as solendJobs,
  fetchers as solendFetchers,
} from './plugins/solend';
import {
  platforms as raydiumPlatforms,
  jobs as raydiumJobs,
  fetchers as raydiumFetchers,
} from './plugins/raydium';
import {
  platforms as orcaPlatforms,
  jobs as orcaJobs,
  fetchers as orcaFetchers,
} from './plugins/orca';
import {
  platforms as meteoraPlatforms,
  jobs as meteoraJobs,
  fetchers as meteoraFetchers,
} from './plugins/meteora';
import {
  platforms as cetusPlatforms,
  jobs as cetusJobs,
  fetchers as cetusFetchers,
} from './plugins/cetus';
import {
  platforms as turbosPlatforms,
  jobs as turbosJobs,
  fetchers as turbosFetchers,
} from './plugins/turbos';
import {
  platforms as thalaPlatforms,
  jobs as thalaJobs,
  fetchers as thalaFetchers,
} from './plugins/thala';
import {
  platforms as tensorPlatforms,
  fetchers as tensorFetchers,
} from './plugins/tensor';
import {
  platforms as ordersPlatforms,
  fetchers as ordersFetchers,
  jobs as ordersJobs,
} from './plugins/orders';
import {
  platforms as aavePlatforms,
  fetchers as aaveFetchers,
  jobs as aaveJobs,
} from './plugins/aave';
import {
  platforms as stakingAptosPlatforms,
  fetchers as stakingAptosFetchers,
} from './plugins/staking-aptos';
import {
  platforms as morphoPlatforms,
  fetchers as morphoFetchers,
  jobs as morphoJobs,
} from './plugins/morpho';
import {
  platforms as driftPlatforms,
  jobs as driftJobs,
  fetchers as driftFetchers,
  airdropFetcher as driftAirdropFetcher,
} from './plugins/drift';
import {
  platforms as mangoPlatforms,
  jobs as mangoJobs,
  fetchers as mangoFetchers,
} from './plugins/mango';
import { jobs as topTokensJobs } from './plugins/top-tokens';
import {
  platforms as liquidityPoolsSeiPlatforms,
  jobs as liquidityPoolsSeiJobs,
  fetchers as liquidityPoolsSeiFetchers,
} from './plugins/liquiditypools-sei';
import {
  platforms as pancakeswapPlatforms,
  jobs as pancakeswapJobs,
  fetchers as pancakeswapFetchers,
} from './plugins/pancakeswap';
import {
  platforms as aftermathPlatforms,
  jobs as aftermathJobs,
  fetchers as aftermathFetchers,
} from './plugins/aftermath';
import {
  platforms as liquidswapPlatforms,
  jobs as liquidswapJobs,
} from './plugins/liquidswap';
import {
  platforms as auxexchangePlatforms,
  jobs as auxexchangeJobs,
} from './plugins/auxexchange';
import {
  jobs as makerJobs,
  platforms as makerPlatforms,
  fetchers as makerFetchers,
} from './plugins/maker';
import {
  jobs as kaminoJobs,
  fetchers as kaminoFetchers,
  platforms as kaminoPlatforms,
} from './plugins/kamino';
import {
  fetchers as bucketFetchers,
  platforms as bucketPlatforms,
} from './plugins/bucket';
import {
  jobs as naviJobs,
  fetchers as naviFetchers,
  platforms as naviPlatforms,
} from './plugins/navi';
import {
  fetchers as scallopFetchers,
  jobs as scallopJobs,
  platforms as scallopPlatforms,
} from './plugins/scallop';
import {
  fetchers as rocketpoolFetchers,
  platforms as rocketpoolPlatforms,
} from './plugins/rocket-pool';
import {
  platforms as lidoPlatforms,
  fetchers as lidoFetchers,
} from './plugins/lido';
import {
  jobs as curveJobs,
  fetchers as curveFetchers,
  platforms as curvePlatforms,
} from './plugins/curve';
import {
  jobs as compoundJobs,
  fetchers as compoundFetchers,
  platforms as compoundPlatforms,
} from './plugins/compound';
import {
  jobs as stargateJobs,
  fetchers as stargateFetchers,
  platforms as stargatePlatforms,
} from './plugins/stargate';
import {
  platforms as staderPlatforms,
  jobs as staderJobs,
  fetchers as staderFetchers,
} from './plugins/stader';
import {
  platforms as uniswapPlatforms,
  jobs as uniswapJobs,
  fetchers as uniswapFetchers,
} from './plugins/uniswap';
import {
  jobs as uniswapV2Jobs,
  fetchers as uniswapV2Fetchers,
} from './plugins/uniswap-v2';
import {
  platforms as balancerPlatforms,
  jobs as balancerJobs,
  fetchers as balancerFetchers,
} from './plugins/balancer';
import {
  platforms as paraswapPlatforms,
  jobs as paraswapJobs,
  fetchers as paraswapFetchers,
} from './plugins/paraswap';
import {
  platforms as hawksightPlatforms,
  fetchers as hawksightFetchers,
} from './plugins/hawksight';
import {
  platforms as realmsPlatforms,
  jobs as realmsJobs,
  fetchers as realmsFetchers,
} from './plugins/daos';
import {
  platforms as maplePlatforms,
  jobs as mapleJobs,
  fetchers as mapleFetchers,
} from './plugins/maple';
import {
  platforms as flexlendPlatforms,
  jobs as flexlendJobs,
  fetchers as flexlendFetchers,
} from './plugins/flexlend';
import {
  platforms as fluxbeamPlatforms,
  jobs as fluxbeamJobs,
  fetchers as fluxbeamFetchers,
} from './plugins/fluxbeam';
import {
  platforms as jupiterPlatforms,
  jobs as jupiterJobs,
  fetchers as jupiterFetchers,
} from './plugins/jupiter';
import {
  platforms as zetaPlatforms,
  jobs as zetaJobs,
  fetchers as zetaFetchers,
} from './plugins/zeta';
import {
  platforms as venusPlatforms,
  jobs as venusJobs,
  fetchers as venusFetchers,
} from './plugins/venus';
import {
  platforms as sushiswapPlatforms,
  jobs as sushiswapJobs,
  fetchers as sushiswapFetchers,
} from './plugins/sushiswap';
import {
  platforms as yearnPlatforms,
  jobs as yearnJobs,
  fetchers as yearnFetchers,
} from './plugins/yearn';
import {
  platforms as atrixPlatforms,
  jobs as atrixJobs,
  fetchers as atrixFetchers,
} from './plugins/atrix';
import {
  platforms as zeroOnePlatforms,
  jobs as zeroOneJobs,
  fetchers as zeroOneFetchers,
} from './plugins/01';
import {
  platforms as gooseFXPlatforms,
  jobs as gooseFXJobs,
  fetchers as gooseFXFetchers,
} from './plugins/goosefx';
import {
  platforms as rainPlatforms,
  jobs as rainJobs,
  fetchers as rainFetchers,
} from './plugins/rain';
import {
  platforms as lifinityPlatforms,
  jobs as lifinityJobs,
  fetchers as lifinityFetchers,
} from './plugins/lifinity';
import {
  platforms as portPlatforms,
  jobs as portJobs,
  fetchers as portFetchers,
} from './plugins/port';
import {
  platforms as instadappPlatforms,
  jobs as instadappJobs,
  fetchers as instadappFetchers,
} from './plugins/instadapp';
import {
  platforms as streamflowPlatforms,
  jobs as streamflowJobs,
  fetchers as streamflowFetchers,
} from './plugins/streamflow';
import {
  platforms as benqiPlatforms,
  jobs as benqiJobs,
  fetchers as benqiFetchers,
} from './plugins/benqi';
import {
  platforms as parclPlatforms,
  jobs as parclJobs,
  fetchers as parclFetchers,
  airdropFetcher as parclAirdropFetcher,
} from './plugins/parcl';
import {
  platforms as pythPlatforms,
  jobs as pythJobs,
  fetchers as pythFetchers,
} from './plugins/pyth';
import {
  platforms as circuitPlatforms,
  jobs as circuitJobs,
  fetchers as circuitFetchers,
} from './plugins/circuit';
import {
  platforms as ariesPlatforms,
  jobs as ariesJobs,
  fetchers as ariesFetchers,
} from './plugins/aries';
import {
  platforms as flashPlatforms,
  jobs as flashJobs,
  fetchers as flashFetchers,
} from './plugins/flash';
import {
  platforms as bonkrewardsPlatforms,
  jobs as bonkrewardsJobs,
  fetchers as bonkrewardsFetchers,
} from './plugins/bonkrewards';
import {
  platforms as accessprotocolPlatforms,
  jobs as accessprotocolJobs,
  fetchers as accessprotocolFetchers,
} from './plugins/accessprotocol';
import {
  platforms as aptinPlatforms,
  jobs as aptinJobs,
  fetchers as aptinFetchers,
} from './plugins/aptin';
import {
  platforms as bsktPlatforms,
  jobs as bsktJobs,
  fetchers as bsktFetchers,
} from './plugins/bskt';
import {
  platforms as genesysgoPlatforms,
  jobs as genesysgoJobs,
  fetchers as genesysgoFetchers,
} from './plugins/genesysgo';
import {
  platforms as auroryPlatforms,
  jobs as auroryJobs,
  fetchers as auroryFetchers,
} from './plugins/aurory';
import {
  platforms as xStakingSolanaPlatforms,
  jobs as xStakingSolanaJobs,
  fetchers as xStakingSolanaFetchers,
} from './plugins/x-staking-solana';
import {
  platforms as splStakingPlatforms,
  jobs as splStakingJobs,
  fetchers as splStakingFetchers,
} from './plugins/armada-staking';
import {
  platforms as abexPlatforms,
  jobs as abexJobs,
  fetchers as abexFetchers,
} from './plugins/abex';
import {
  platforms as kaiPlatforms,
  jobs as kaiJobs,
  fetchers as kaiFetchers,
} from './plugins/kai';
import {
  platforms as suilendPlatforms,
  jobs as suilendJobs,
  fetchers as suilendFetchers,
} from './plugins/suilend';
import {
  platforms as symmetryPlatforms,
  jobs as symmetryJobs,
  fetchers as symmetryFetchers,
} from './plugins/symmetry';
import {
  platforms as staratlasPlatforms,
  jobs as staratlasJobs,
  fetchers as staratlasFetchers,
} from './plugins/staratlas';
import {
  platforms as tulipPlatforms,
  jobs as tulipJobs,
  fetchers as tulipFetchers,
} from './plugins/tulip';
import {
  platforms as phoenixPlatforms,
  jobs as phoenixJobs,
  fetchers as phoenixFetchers,
} from './plugins/phoenix';
import {
  platforms as uxdPlatforms,
  jobs as uxdJobs,
  fetchers as uxdFetchers,
} from './plugins/uxd';
import {
  platforms as wormholePlatforms,
  jobs as wormholeJobs,
  fetchers as wormholeFetchers,
} from './plugins/wormhole';
import {
  platforms as banxPlatforms,
  jobs as banxJobs,
  fetchers as banxFetchers,
} from './plugins/banx';
import {
  platforms as nosanaPlatforms,
  jobs as nosanaJobs,
  fetchers as nosanaFetchers,
} from './plugins/nosana';
import {
  platforms as jitoPlatforms,
  jobs as jitoJobs,
  fetchers as jitoFetchers,
} from './plugins/jito';
import {
  platforms as magicedenPlatforms,
  jobs as magicedenJobs,
  fetchers as magicedenFetchers,
} from './plugins/magiceden';
import {
  platforms as clonePlatforms,
  jobs as cloneJobs,
  fetchers as cloneFetchers,
} from './plugins/clone';
import {
  platforms as sandglassPlatforms,
  jobs as sandglassJobs,
  fetchers as sandglassFetchers,
} from './plugins/sandglass';
import {
  platforms as kriyaPlatforms,
  jobs as kriyaJobs,
  fetchers as kriyaFetchers,
} from './plugins/kriya';
import {
  platforms as haedalPlatforms,
  jobs as haedalJobs,
  fetchers as haedalFetchers,
} from './plugins/haedal';
import {
  platforms as flowxPlatforms,
  jobs as flowxJobs,
  fetchers as flowxFetchers,
} from './plugins/flowx';
import {
  platforms as elixirPlatforms,
  jobs as elixirJobs,
  fetchers as elixirFetchers,
} from './plugins/elixir';

export {
  walletTokensPlatform,
  walletNftsPlatform,
} from './plugins/tokens/constants';
export { getFetchersByAddressSystem } from './utils/misc/getFetchersByAddressSystem';

export * from './Cache';
export * from './Fetcher';
export * from './AirdropFetcher';
export * from './Job';
export * from './utils/name-service';
export * from './utils/blank';
export { getLlamaProtocolsJob } from './plugins/llama-protocols';

// PLATFORMS //
export const platforms: Platform[] = [
  ...orphanPlatorms,
  ...aavePlatforms,
  ...orcaPlatforms,
  ...cetusPlatforms,
  ...driftPlatforms,
  ...auxexchangePlatforms,
  ...liquidityPoolsSeiPlatforms,
  ...liquidswapPlatforms,
  ...aftermathPlatforms,
  ...pancakeswapPlatforms,
  ...tokensPlatforms,
  ...nativeStakePlatforms,
  ...marinadePlatforms,
  ...saberPlatforms,
  ...solendPlatforms,
  ...marginfiPlatforms,
  ...raydiumPlatforms,
  ...meteoraPlatforms,
  ...turbosPlatforms,
  ...thalaPlatforms,
  ...tensorPlatforms,
  ...ordersPlatforms,
  ...stakingAptosPlatforms,
  ...morphoPlatforms,
  ...mangoPlatforms,
  ...kaminoPlatforms,
  ...bucketPlatforms,
  ...naviPlatforms,
  ...scallopPlatforms,
  ...makerPlatforms,
  ...rocketpoolPlatforms,
  ...lidoPlatforms,
  ...curvePlatforms,
  ...compoundPlatforms,
  ...stargatePlatforms,
  ...staderPlatforms,
  ...uniswapPlatforms,
  ...balancerPlatforms,
  ...paraswapPlatforms,
  ...hawksightPlatforms,
  ...realmsPlatforms,
  ...maplePlatforms,
  ...flexlendPlatforms,
  ...fluxbeamPlatforms,
  ...zetaPlatforms,
  ...venusPlatforms,
  ...sushiswapPlatforms,
  ...yearnPlatforms,
  ...atrixPlatforms,
  ...zeroOnePlatforms,
  ...gooseFXPlatforms,
  ...rainPlatforms,
  ...lifinityPlatforms,
  ...portPlatforms,
  ...instadappPlatforms,
  ...streamflowPlatforms,
  ...benqiPlatforms,
  ...parclPlatforms,
  ...pythPlatforms,
  ...jupiterPlatforms,
  ...circuitPlatforms,
  ...ariesPlatforms,
  ...flashPlatforms,
  ...bonkrewardsPlatforms,
  ...accessprotocolPlatforms,
  ...aptinPlatforms,
  ...bsktPlatforms,
  ...genesysgoPlatforms,
  ...auroryPlatforms,
  ...xStakingSolanaPlatforms,
  ...splStakingPlatforms,
  ...abexPlatforms,
  ...kaiPlatforms,
  ...suilendPlatforms,
  ...symmetryPlatforms,
  ...staratlasPlatforms,
  ...tulipPlatforms,
  ...phoenixPlatforms,
  ...uxdPlatforms,
  ...wormholePlatforms,
  ...banxPlatforms,
  ...nosanaPlatforms,
  ...jitoPlatforms,
  ...magicedenPlatforms,
  ...flowxPlatforms,
  ...clonePlatforms,
  ...sandglassPlatforms,
  ...kriyaPlatforms,
  ...haedalPlatforms,
  ...elixirPlatforms,
];

// JOBS //
export const jobs: Job[] = [
  ...tokensJobs,
  ...nativeStakeJobs,
  ...thalaJobs,
  ...marginfiJobs,
  ...raydiumJobs,
  ...solendJobs,
  ...meteoraJobs,
  ...orcaJobs,
  ...driftJobs,
  ...mangoJobs,
  ...cetusJobs,
  ...turbosJobs,
  ...topTokensJobs,
  ...pancakeswapJobs,
  ...auxexchangeJobs,
  ...saberJobs,
  ...aaveJobs,
  ...ordersJobs,
  ...morphoJobs,
  ...makerJobs,
  ...liquidityPoolsSeiJobs,
  ...aftermathJobs,
  ...liquidswapJobs,
  ...kaminoJobs,
  ...naviJobs,
  ...scallopJobs,
  ...curveJobs,
  ...compoundJobs,
  ...stargateJobs,
  ...staderJobs,
  ...uniswapV2Jobs,
  ...uniswapJobs,
  ...balancerJobs,
  ...paraswapJobs,
  ...realmsJobs,
  ...mapleJobs,
  ...flexlendJobs,
  ...fluxbeamJobs,
  ...jupiterJobs,
  ...zetaJobs,
  ...venusJobs,
  ...sushiswapJobs,
  ...yearnJobs,
  ...atrixJobs,
  ...zeroOneJobs,
  ...gooseFXJobs,
  ...rainJobs,
  ...lifinityJobs,
  ...portJobs,
  ...instadappJobs,
  ...streamflowJobs,
  ...benqiJobs,
  ...parclJobs,
  ...pythJobs,
  ...circuitJobs,
  ...ariesJobs,
  ...flashJobs,
  ...bonkrewardsJobs,
  ...accessprotocolJobs,
  ...aptinJobs,
  ...bsktJobs,
  ...genesysgoJobs,
  ...auroryJobs,
  ...xStakingSolanaJobs,
  ...splStakingJobs,
  ...abexJobs,
  ...kaiJobs,
  ...suilendJobs,
  ...symmetryJobs,
  ...staratlasJobs,
  ...tulipJobs,
  ...phoenixJobs,
  ...uxdJobs,
  ...wormholeJobs,
  ...banxJobs,
  ...nosanaJobs,
  ...jitoJobs,
  ...magicedenJobs,
  ...cloneJobs,
  ...switchboardJobs,
  ...sandglassJobs,
  ...kriyaJobs,
  ...haedalJobs,
  ...flowxJobs,
  ...elixirJobs,
];

// FETCHERS //
export const fetchers: Fetcher[] = [
  ...tokensFetchers,
  ...nativeStakeFetchers,
  ...tensorFetchers,
  ...marginfiFetchers,
  ...marinadeFetchers,
  ...solendFetchers,
  ...thalaFetchers,
  ...raydiumFetchers,
  ...orcaFetchers,
  ...driftFetchers,
  ...mangoFetchers,
  ...kaminoFetchers,
  ...cetusFetchers,
  ...turbosFetchers,
  ...stakingAptosFetchers,
  ...pancakeswapFetchers,
  ...aftermathFetchers,
  ...aaveFetchers,
  ...ordersFetchers,
  ...morphoFetchers,
  ...liquidityPoolsSeiFetchers,
  ...bucketFetchers,
  ...naviFetchers,
  ...scallopFetchers,
  ...rocketpoolFetchers,
  ...curveFetchers,
  ...stargateFetchers,
  ...makerFetchers,
  ...compoundFetchers,
  ...lidoFetchers,
  ...staderFetchers,
  ...uniswapV2Fetchers,
  ...uniswapFetchers,
  ...balancerFetchers,
  ...paraswapFetchers,
  ...hawksightFetchers,
  ...realmsFetchers,
  ...mapleFetchers,
  ...flexlendFetchers,
  ...fluxbeamFetchers,
  ...jupiterFetchers,
  ...zetaFetchers,
  ...venusFetchers,
  ...sushiswapFetchers,
  ...yearnFetchers,
  ...atrixFetchers,
  ...zeroOneFetchers,
  ...gooseFXFetchers,
  ...rainFetchers,
  ...lifinityFetchers,
  ...portFetchers,
  ...instadappFetchers,
  ...meteoraFetchers,
  ...streamflowFetchers,
  ...benqiFetchers,
  ...parclFetchers,
  ...pythFetchers,
  ...circuitFetchers,
  ...ariesFetchers,
  ...flashFetchers,
  ...bonkrewardsFetchers,
  ...accessprotocolFetchers,
  ...aptinFetchers,
  ...bsktFetchers,
  ...genesysgoFetchers,
  ...auroryFetchers,
  ...xStakingSolanaFetchers,
  ...splStakingFetchers,
  ...abexFetchers,
  ...kaiFetchers,
  ...suilendFetchers,
  ...symmetryFetchers,
  ...staratlasFetchers,
  ...tulipFetchers,
  ...phoenixFetchers,
  ...uxdFetchers,
  ...wormholeFetchers,
  ...banxFetchers,
  ...nosanaFetchers,
  ...jitoFetchers,
  ...magicedenFetchers,
  ...cloneFetchers,
  ...sandglassFetchers,
  ...kriyaFetchers,
  ...haedalFetchers,
  ...flowxFetchers,
  ...elixirFetchers,
];
export const fetchersByAddressSystem = getFetchersByAddressSystem(fetchers);

export const airdropFetchers: AirdropFetcher[] = [
  driftAirdropFetcher,
  parclAirdropFetcher,
];
export const airdropFetchersByAddressSystem =
  getFetchersByAddressSystem(airdropFetchers);
