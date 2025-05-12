import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { dualPoolPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { PoolState, userPoolLiquidityStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedAccount } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userLiquidities = await ParsedGpa.build(
    client,
    userPoolLiquidityStruct,
    dualPoolPid
  )
    .addFilter('accountDiscriminator', [0, 141, 89, 29, 236, 6, 14, 15])
    .addFilter('user', new PublicKey(owner))
    .addDataSizeFilter(217)
    .run();
  if (userLiquidities.length === 0) return [];

  const cachedPoolStates = await cache.getItems<ParsedAccount<PoolState>>(
    userLiquidities.map((liquidity) => liquidity.poolState.toString()),
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  for (const account of userLiquidities) {
    const poolState = cachedPoolStates.find(
      (pool) => pool?.pubkey.toString() === account.poolState.toString()
    );
    if (!poolState) continue;

    const liqElement = registry.addElementLiquidity({
      label: 'LiquidityPool',
      ref: account.pubkey.toString(),
      sourceRefs: [{ address: poolState.pubkey.toString(), name: 'Pool' }],
      link: 'https://app.goosefx.io/gamma',
    });

    const liq = liqElement.addLiquidity({});
    liq.addAsset({
      address: poolState.token0Mint.toString(),
      amount: account.token0Deposited
        .minus(account.token0Withdrawn)
        .dividedBy(10 ** poolState.mint0Decimals),
      alreadyShifted: true,
    });
    liq.addAsset({
      address: poolState.token1Mint.toString(),
      amount: account.token1Deposited
        .minus(account.token1Withdrawn)
        .dividedBy(10 ** poolState.mint1Decimals),
      alreadyShifted: true,
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-dual-pools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
