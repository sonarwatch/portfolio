import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { platformId, poolsCacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { CachedPool } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { positionStruct } from './structs';
import { getPositionAddress, getStatus } from './helpers';

export const FIXED_ONE = new BigNumber(1000000000);

const poolsMemo = new MemoizedCache<CachedPool[]>(poolsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const pools = await poolsMemo.getItem(cache);
  if (!pools) throw new Error('Pools not cached');

  const positionsKeys = pools.map((p) => getPositionAddress(p.pubkey, owner));
  const positions = await getParsedMultipleAccountsInfo(
    connection,
    positionStruct,
    positionsKeys
  );
  if (positions.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (const position of positions) {
    if (!position) continue;

    const pool = pools.find((p) => p.pubkey === position.pool.toString());
    if (!pool) continue;

    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      ref: position.pubkey,
      link: `https://elemental.fund/?address=${pool.pubkey.toString()}`,
      sourceRefs: [{ name: 'Pool', address: pool.pubkey }],
    });

    element.addAsset({
      address: pool.liquidity_mint,
      amount: position.amount.dividedBy(pool.per_token_amount),
      alreadyShifted: true,
      attributes: { tags: [getStatus(position, pool)] },
    });

    const claimableAmount = position.amount
      .times(pool.reward_per_token)
      .div(FIXED_ONE)
      .minus(position.reward_before_deposit)
      .plus(position.reward_earned)
      .minus(position.reward_claimed);
    element.addAsset({
      address: pool.liquidity_mint,
      amount: claimableAmount,
      alreadyShifted: false,
      attributes: { isClaimable: true },
    });

    element.addAsset({
      address: pool.liquidity_mint,
      amount: position.deactivating_amount.div(pool.per_token_amount),
      alreadyShifted: true,
      attributes: { tags: ['deactivating'] },
    });

    element.addAsset({
      address: pool.liquidity_mint,
      amount: position.claiming_amount.div(pool.per_token_amount),
      alreadyShifted: true,
      attributes: { tags: ['claiming'] },
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
