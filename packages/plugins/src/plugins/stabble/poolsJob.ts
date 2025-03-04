import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, stableIdlItem, weightedIdlItem } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { stableFilter, weightedFilter } from './filters';
import { StablePool, WeightedPool } from './types';
import { getAssetBatchDasAsMap } from '../../utils/solana/das/getAssetBatchDas';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const dasUrl = getSolanaDasEndpoint();

  const pools = (
    await Promise.all([
      getAutoParsedProgramAccounts<StablePool>(
        connection,
        stableIdlItem,
        stableFilter
      ),
      getAutoParsedProgramAccounts<WeightedPool>(
        connection,
        weightedIdlItem,
        weightedFilter
      ),
    ])
  ).flat();

  const mints: Set<string> = new Set();
  const lpMints: Set<string> = new Set();

  pools.forEach((pool) => {
    pool.tokens.forEach((token) => {
      mints.add(token.mint);
    });
    lpMints.add(pool.mint);
  });

  const [tokenPrices, heliusAssets] = await Promise.all([
    cache.getTokenPricesAsMap(mints, NetworkId.solana),
    getAssetBatchDasAsMap(dasUrl, [...lpMints]),
  ]);
  const sources: TokenPriceSource[] = [];

  pools.forEach((pool) => {
    const heliusAsset = heliusAssets.get(pool.mint);
    if (!heliusAsset?.token_info) return;

    const supply = new BigNumber(heliusAsset.token_info.supply).dividedBy(
      10 ** Number(heliusAsset.token_info.decimals)
    );

    const underlyings = [];
    for (const token of pool.tokens) {
      const tokenPrice = tokenPrices.get(token.mint);
      if (!tokenPrice) return;

      const tokenAmount = token.scalingUp
        ? new BigNumber(token.balance).dividedBy(token.scalingFactor)
        : new BigNumber(token.balance).times(token.scalingFactor);

      const amountPerLp = tokenAmount
        .dividedBy(10 ** Number(token.decimals))
        .dividedBy(supply);

      underlyings.push({
        address: tokenPrice.address,
        decimals: tokenPrice.decimals,
        amountPerLp: amountPerLp.toNumber(),
        networkId: NetworkId.solana,
        price: tokenPrice.price,
      });
    }

    sources.push({
      address: pool.mint,
      decimals: heliusAsset.token_info.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      price: underlyings.reduce(
        (acc: number, u) => u.price * u.amountPerLp + acc,
        0
      ),
      timestamp: Date.now(),
      weight: 1,
      underlyings,
      sourceRefs: [{ address: pool.pubkey.toString(), name: 'Pool' }],
    });
  });

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
  labels: ['normal'],
};
export default job;
