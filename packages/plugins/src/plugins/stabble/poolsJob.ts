import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, stableProgramId, weightedProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getAssetBatchDasAsMap } from '../../utils/solana/das/getAssetBatchDas';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { stablePoolStruct, weightedPoolStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { PoolInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const dasUrl = getSolanaDasEndpoint();

  const pools = (
    await Promise.all([
      ParsedGpa.build(
        connection,
        stablePoolStruct,
        new PublicKey(stableProgramId)
      )
        .addFilter(
          'vault',
          new PublicKey('stab1io8dHvK26KoHmTwwHyYmHRbUWbyEJx6CdrGabC')
        )
        .run(),
      ParsedGpa.build(
        connection,
        weightedPoolStruct,
        new PublicKey(weightedProgramId)
      )
        .addFilter(
          'vault',
          new PublicKey('w8edo9a9TDw52c1rBmVbP6dNakaAuFiPjDd52ZJwwVi')
        )
        .run(),
    ])
  ).flat();

  const mints: Set<string> = new Set();
  const lpMints: Set<string> = new Set();

  pools.forEach((pool) => {
    pool.tokens.forEach((token) => {
      mints.add(token.mint.toString());
    });
    lpMints.add(pool.mint.toString());
  });

  const [tokenPrices, heliusAssets] = await Promise.all([
    cache.getTokenPricesAsMap(mints, NetworkId.solana),
    getAssetBatchDasAsMap(dasUrl, [...lpMints]),
  ]);
  const sources: TokenPriceSource[] = [];
  const poolInfos: { key: string; value: PoolInfo }[] = [];
  pools.forEach((pool) => {
    const heliusAsset = heliusAssets.get(pool.mint.toString());
    if (!heliusAsset?.token_info) return;

    const supply = new BigNumber(heliusAsset.token_info.supply).dividedBy(
      10 ** Number(heliusAsset.token_info.decimals)
    );

    const underlyings = [];
    for (const token of pool.tokens) {
      const tokenPrice = tokenPrices.get(token.mint.toString());
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
      address: pool.mint.toString(),
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
      link: `https://app.stabble.org/liquidity-pools/${pool.pubkey.toString()}/deposit`,
      sourceRefs: [{ address: pool.pubkey.toString(), name: 'Pool' }],
    });

    poolInfos.push({
      key: pool.pubkey.toString(),
      value: {
        address: pool.pubkey.toString(),
        mint: pool.mint.toString(),
      },
    });
  });

  await cache.setItems(poolInfos, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
