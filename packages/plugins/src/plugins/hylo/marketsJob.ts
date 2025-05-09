import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, shyUsdMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { hyloStruct } from './structs';
import { getCachedDecimalsForToken } from '../../utils/misc/getCachedDecimalsForToken';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

// https://hylo.so/api/metrics

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const hylo = await getParsedAccountInfo(
    client,
    hyloStruct,
    new PublicKey('9cd2sAfbBvKs4SX9YKo4dcjwP3TgTVQ8dT5koshGcDND')
  );

  if (!hylo) return;

  const [
    xSolSupply,
    hyUsdSupply,
    shyUsdSupply,
    xSolDecimals,
    hyDecimals,
    shyUsdDecimals,
    solTokenPrice,
    stakedHyUsd,
  ] = await Promise.all([
    client.getTokenSupply(hylo.levercoin_mint),
    client.getTokenSupply(hylo.stablecoin_mint),
    client.getTokenSupply(new PublicKey(shyUsdMint)),
    getCachedDecimalsForToken(
      cache,
      hylo.levercoin_mint.toString(),
      NetworkId.solana
    ),
    getCachedDecimalsForToken(
      cache,
      hylo.stablecoin_mint.toString(),
      NetworkId.solana
    ),
    getCachedDecimalsForToken(cache, shyUsdMint, NetworkId.solana),
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
    client.getTokenAccountBalance(
      new PublicKey('EqozKyMj7FVnLHc2cJj3VC25aBr4AhVh1cGM2WDajGe9')
    ),
  ]);

  // xSOL
  if (
    solTokenPrice &&
    hyUsdSupply.value.uiAmount &&
    xSolSupply.value.uiAmount &&
    xSolDecimals
  ) {
    const collateralTvl = hylo.total_sol_cache.total_sol.bits
      .shiftedBy(hylo.total_sol_cache.total_sol.exp)
      .multipliedBy(solTokenPrice.price);

    const xSolPrice =
      (collateralTvl.toNumber() - hyUsdSupply.value.uiAmount) /
      xSolSupply.value.uiAmount;

    await cache.setTokenPriceSource({
      address: hylo.levercoin_mint.toString(),
      decimals: xSolDecimals,
      id: hylo.pubkey.toString(),
      platformId,
      networkId: NetworkId.solana,
      price: xSolPrice,
      timestamp: Date.now(),
      weight: 0.5,
      link: 'https://hylo.so/xsol',
    });
  }

  // hyUSD
  if (hyDecimals) {
    await cache.setTokenPriceSource({
      address: hylo.stablecoin_mint.toString(),
      decimals: hyDecimals,
      id: hylo.pubkey.toString(),
      platformId,
      networkId: NetworkId.solana,
      price: 1,
      timestamp: Date.now(),
      weight: 0.5,
      link: 'https://hylo.so/hyusd',
    });
  }

  // shyUSD
  if (
    shyUsdDecimals &&
    shyUsdSupply.value.uiAmount &&
    stakedHyUsd.value.uiAmount
  ) {
    await cache.setTokenPriceSource({
      address: shyUsdMint,
      decimals: shyUsdDecimals,
      id: hylo.pubkey.toString(),
      platformId,
      networkId: NetworkId.solana,
      price: stakedHyUsd.value.uiAmount / shyUsdSupply.value.uiAmount,
      timestamp: Date.now(),
      weight: 0.5,
      link: 'https://hylo.so/hyusd',
    });

    const epochsPerYear = 182.5;
    const lastEpochYield =
      hylo.yield_harvest_cache.stablecoin_yield_to_pool.bits
        .shiftedBy(hylo.yield_harvest_cache.stablecoin_yield_to_pool.exp)
        .dividedBy(
          hylo.yield_harvest_cache.stability_pool_cap.bits.shiftedBy(
            hylo.yield_harvest_cache.stability_pool_cap.exp
          )
        )
        .toNumber();

    const apr = lastEpochYield * epochsPerYear;
    const apy = (1 + lastEpochYield) ** epochsPerYear - 1;

    await cache.setTokenYield({
      address: shyUsdMint,
      networkId: NetworkId.solana,
      yield: { apr, apy },
      timestamp: Date.now(),
    });
  }
};
const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
