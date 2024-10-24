import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from './Fetcher';
import { AirdropFetcher } from './AirdropFetcher';
import { Job } from './Job';
import { getFetchersByAddressSystem } from './utils/misc/getFetchersByAddressSystem';
import orphanPlatforms from './orphanPlatforms';
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
  platforms as savePlatforms,
  jobs as saveJobs,
  fetchers as saveFetchers,
} from './plugins/save';
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
  airdropFetchers as kaminoAirdropFetchers,
} from './plugins/kamino';
import {
  jobs as bucketJobs,
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
  platforms as luloPlatforms,
  jobs as luloJobs,
  fetchers as luloFetchers,
} from './plugins/lulo';
import {
  platforms as fluxbeamPlatforms,
  jobs as fluxbeamJobs,
  fetchers as fluxbeamFetchers,
} from './plugins/fluxbeam';
import {
  platforms as jupiterPlatforms,
  jobs as jupiterJobs,
  fetchers as jupiterFetchers,
  airdropFetchers as jupiterAirdropFetchers,
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
  platforms as driftMMPlatforms,
  jobs as driftMMJobs,
  fetchers as driftMMFetchers,
} from './plugins/drift-market-maker-vault';
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
  platforms as typusPlatforms,
  jobs as typusJobs,
  fetchers as typusFetchers,
} from './plugins/typus';
import {
  jobs as moleJobs,
  fetchers as moleFetchers,
  platforms as molePlatforms,
} from './plugins/mole';
import {
  jobs as bonfidaJobs,
  fetchers as bonfidaFetchers,
  platforms as bonfidaPlatforms,
} from './plugins/bonfida';
import {
  jobs as cropperJobs,
  fetchers as cropperFetchers,
  platforms as cropperPlatforms,
} from './plugins/cropper';
import {
  jobs as hedgehogJobs,
  fetchers as hedgehogFetchers,
  platforms as hedgehogPlatforms,
} from './plugins/hedgehog';
import {
  jobs as whalesmarketJobs,
  fetchers as whalesmarketFetchers,
  platforms as whalesmarketPlatforms,
} from './plugins/whalesmarket';
import {
  jobs as futarchyJobs,
  fetchers as futarchyFetchers,
  platforms as futarchyPlatforms,
} from './plugins/futarchy';
import {
  platforms as elixirPlatforms,
  jobs as elixirJobs,
  fetchers as elixirFetchers,
} from './plugins/elixir';
import {
  platforms as moonwalkPlatforms,
  jobs as moonwalkJobs,
  fetchers as moonwalkFetchers,
} from './plugins/moonwalk';
import {
  jobs as bluefinJobs,
  fetchers as bluefinFetchers,
  platforms as bluefinPlatforms,
} from './plugins/bluefin';
import {
  platforms as citrusPlatforms,
  jobs as citrusJobs,
  fetchers as citrusFetchers,
} from './plugins/citrus';
import {
  platforms as sharkyPlatforms,
  jobs as sharkyJobs,
  fetchers as sharkyFetchers,
} from './plugins/sharky';
import {
  platforms as sanctumPlatforms,
  jobs as sanctumJobs,
  fetchers as sanctumFetchers,
  airdropFetchers as sanctumAirdropFetchers,
} from './plugins/sanctum';
import {
  platforms as allbridgePlatforms,
  jobs as allbridgeJobs,
  fetchers as allbridgeFetchers,
} from './plugins/allbridge';
import {
  platforms as famousfoxfederationPlatforms,
  jobs as famousfoxfederationJobs,
  fetchers as famousfoxfederationFetchers,
} from './plugins/famousfoxfederation';
import {
  platforms as nxfinancePlatforms,
  jobs as nxfinanceJobs,
  fetchers as nxfinanceFetchers,
} from './plugins/nxfinance';
import {
  platforms as echelonPlatforms,
  jobs as echelonJobs,
  fetchers as echelonFetchers,
} from './plugins/echelon';
import {
  platforms as solayerPlatforms,
  jobs as solayerJobs,
  fetchers as solayerFetchers,
} from './plugins/solayer';
import {
  platforms as picassoPlatforms,
  jobs as picassoJobs,
  fetchers as picassoFetchers,
} from './plugins/picasso';
import {
  platforms as quarryPlatforms,
  jobs as quarryJobs,
  fetchers as quarryFetchers,
} from './plugins/quarry';
import {
  platforms as thevaultPlatforms,
  jobs as thevaultJobs,
  fetchers as thevaultFetchers,
} from './plugins/thevault';
import {
  platforms as deepbookPlatforms,
  jobs as deepbookJobs,
  fetchers as deepbookFetchers,
  airdropFetcher as deepbookAirdropFetcher,
} from './plugins/deepbook';
import {
  platforms as suinsPlatforms,
  jobs as suinsJobs,
  fetchers as suinsFetchers,
  airdropFetcher as suinsAirdropFetcher,
} from './plugins/suins';
import {
  platforms as debridgePlatforms,
  jobs as debridgeJobs,
  fetchers as debridgeFetchers,
  airdropFetchers as debridgeAirdropFetchers,
} from './plugins/debridge';
import {
  platforms as alphafiPlatforms,
  jobs as alphafiJobs,
  fetchers as alphafiFetchers,
} from './plugins/alphafi';
import {
  platforms as jewelPlatforms,
  jobs as jewelJobs,
  fetchers as jewelFetchers,
} from './plugins/jewel';
import {
  platforms as tradeportPlatforms,
  jobs as tradeportJobs,
  fetchers as tradeportFetchers,
} from './plugins/tradeport';
import {
  platforms as bluemovePlatforms,
  jobs as bluemoveJobs,
  fetchers as bluemoveFetchers,
} from './plugins/bluemove';
import {
  platforms as stabblePlatforms,
  jobs as stabbleJobs,
  fetchers as stabbleFetchers,
} from './plugins/stabble';
import {
  platforms as franciumPlatforms,
  jobs as franciumJobs,
  fetchers as franciumFetchers,
} from './plugins/francium';
import {
  platforms as adrasteaPlatforms,
  jobs as adrasteaJobs,
  fetchers as adrasteaFetchers,
} from './plugins/adrastea';
import {
  platforms as elementalPlatforms,
  jobs as elementalJobs,
  fetchers as elementalFetchers,
} from './plugins/elemental';
import {
  platforms as adrenaPlatforms,
  jobs as adrenaJobs,
  fetchers as adrenaFetchers,
} from './plugins/adrena';
import {
  platforms as joulePlatforms,
  jobs as jouleJobs,
  fetchers as jouleFetchers,
} from './plugins/joule';
import {
  platforms as mesoPlatforms,
  jobs as mesoJobs,
  fetchers as mesoFetchers,
} from './plugins/meso';
import {
  platforms as loopscalePlatforms,
  jobs as loopscaleJobs,
  fetchers as loopscaleFetchers,
} from './plugins/loopscale';
import {
  platforms as vaultkaPlatforms,
  jobs as vaultkaJobs,
  fetchers as vaultkaFetchers,
} from './plugins/vaultka';
import {
  platforms as loverflowPlatforms,
  jobs as loverflowJobs,
  fetchers as loverflowFetchers,
} from './plugins/loverflow';
import {
  platforms as zeloPlatforms,
  jobs as zeloJobs,
  fetchers as zeloFetchers,
} from './plugins/zelo';

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
  ...orphanPlatforms,
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
  ...savePlatforms,
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
  ...luloPlatforms,
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
  ...driftMMPlatforms,
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
  ...typusPlatforms,
  ...molePlatforms,
  ...bonfidaPlatforms,
  ...cropperPlatforms,
  ...hedgehogPlatforms,
  ...whalesmarketPlatforms,
  ...futarchyPlatforms,
  ...elixirPlatforms,
  ...moonwalkPlatforms,
  ...bluefinPlatforms,
  ...citrusPlatforms,
  ...sharkyPlatforms,
  ...sanctumPlatforms,
  ...allbridgePlatforms,
  ...famousfoxfederationPlatforms,
  ...nxfinancePlatforms,
  ...echelonPlatforms,
  ...solayerPlatforms,
  ...picassoPlatforms,
  ...quarryPlatforms,
  ...thevaultPlatforms,
  ...deepbookPlatforms,
  ...suinsPlatforms,
  ...debridgePlatforms,
  ...alphafiPlatforms,
  ...jewelPlatforms,
  ...tradeportPlatforms,
  ...bluemovePlatforms,
  ...stabblePlatforms,
  ...franciumPlatforms,
  ...adrasteaPlatforms,
  ...elementalPlatforms,
  ...adrenaPlatforms,
  ...joulePlatforms,
  ...mesoPlatforms,
  ...loopscalePlatforms,
  ...vaultkaPlatforms,
  ...loverflowPlatforms,
  ...zeloPlatforms,
];

// JOBS //
export const jobs: Job[] = [
  ...tokensJobs,
  ...nativeStakeJobs,
  ...thalaJobs,
  ...marginfiJobs,
  ...raydiumJobs,
  ...saveJobs,
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
  ...bucketJobs,
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
  ...luloJobs,
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
  ...driftMMJobs,
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
  ...typusJobs,
  ...flowxJobs,
  ...moleJobs,
  ...bonfidaJobs,
  ...cropperJobs,
  ...hedgehogJobs,
  ...whalesmarketJobs,
  ...futarchyJobs,
  ...elixirJobs,
  ...moonwalkJobs,
  ...bluefinJobs,
  ...citrusJobs,
  ...sharkyJobs,
  ...sanctumJobs,
  ...allbridgeJobs,
  ...famousfoxfederationJobs,
  ...nxfinanceJobs,
  ...echelonJobs,
  ...solayerJobs,
  ...picassoJobs,
  ...quarryJobs,
  ...thevaultJobs,
  ...deepbookJobs,
  ...suinsJobs,
  ...debridgeJobs,
  ...alphafiJobs,
  ...jewelJobs,
  ...tradeportJobs,
  ...bluemoveJobs,
  ...stabbleJobs,
  ...franciumJobs,
  ...adrasteaJobs,
  ...elementalJobs,
  ...adrenaJobs,
  ...jouleJobs,
  ...mesoJobs,
  ...loopscaleJobs,
  ...vaultkaJobs,
  ...loverflowJobs,
  ...zeloJobs,
];

// FETCHERS //
export const fetchers: Fetcher[] = [
  ...tokensFetchers,
  ...nativeStakeFetchers,
  ...tensorFetchers,
  ...marginfiFetchers,
  ...marinadeFetchers,
  ...saveFetchers,
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
  ...luloFetchers,
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
  ...driftMMFetchers,
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
  ...typusFetchers,
  ...flowxFetchers,
  ...moleFetchers,
  ...bonfidaFetchers,
  ...cropperFetchers,
  ...hedgehogFetchers,
  ...whalesmarketFetchers,
  ...futarchyFetchers,
  ...elixirFetchers,
  ...moonwalkFetchers,
  ...bluefinFetchers,
  ...citrusFetchers,
  ...sharkyFetchers,
  ...sanctumFetchers,
  ...allbridgeFetchers,
  ...famousfoxfederationFetchers,
  ...nxfinanceFetchers,
  ...echelonFetchers,
  ...solayerFetchers,
  ...picassoFetchers,
  ...quarryFetchers,
  ...thevaultFetchers,
  ...deepbookFetchers,
  ...suinsFetchers,
  ...debridgeFetchers,
  ...alphafiFetchers,
  ...jewelFetchers,
  ...tradeportFetchers,
  ...bluemoveFetchers,
  ...stabbleFetchers,
  ...franciumFetchers,
  ...adrasteaFetchers,
  ...elementalFetchers,
  ...adrenaFetchers,
  ...jouleFetchers,
  ...mesoFetchers,
  ...loopscaleFetchers,
  ...vaultkaFetchers,
  ...loverflowFetchers,
  ...zeloFetchers,
];
export const fetchersByAddressSystem = getFetchersByAddressSystem(fetchers);

export const airdropFetchers: AirdropFetcher[] = [
  ...jupiterAirdropFetchers,
  ...kaminoAirdropFetchers,
  ...sanctumAirdropFetchers,
  driftAirdropFetcher,
  parclAirdropFetcher,
  deepbookAirdropFetcher,
  suinsAirdropFetcher,
  ...debridgeAirdropFetchers,
];
export const airdropFetchersByAddressSystem =
  getFetchersByAddressSystem(airdropFetchers);
