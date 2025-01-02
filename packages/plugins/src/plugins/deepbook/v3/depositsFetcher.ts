import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { platformId } from '../constants';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { getDeepbookBalanceManagerIds, getLockedBalances } from './helpers';
import { getClientSui } from '../../../utils/clients';
import { PoolSummary } from '../types';
import { poolsCacheKey } from './constants';
import { multiGetObjects } from '../../../utils/sui/multiGetObjects';
import { ID } from '../../../utils/sui/types/id';
import { multipleGetDynamicFieldsObjectsSafe } from '../../../utils/sui/multipleGetDynamicFieldsObjectsSafe';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const deepbookBalanceManagerIds = await getDeepbookBalanceManagerIds(
    client,
    owner
  );

  if (!deepbookBalanceManagerIds.length) return [];

  const pools = await cache.getItem<PoolSummary[]>(poolsCacheKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });

  if (!pools) return [];

  const [unflattenedLockedBalances, deepbookBalanceManagers] =
    await Promise.all([
      Promise.all(
        deepbookBalanceManagerIds.map((deepbookBalanceManagerId) =>
          getLockedBalances(pools, client, owner, deepbookBalanceManagerId)
        )
      ),
      multiGetObjects<{
        owner: string;
        id: ID;
        balances: {
          type: string;
          fields: {
            id: ID;
            size: string;
          };
        };
      }>(client, deepbookBalanceManagerIds),
    ]);

  const lockedBalances = unflattenedLockedBalances.flat();

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: 'V3',
  });

  // Locked
  lockedBalances.forEach((balance) => {
    element.addAsset({
      address: balance.baseAsset,
      amount: balance.base,
    });
    element.addAsset({
      address: balance.quoteAsset,
      amount: balance.quote,
    });
  });

  // Free Balance
  if (deepbookBalanceManagers.length) {
    const balanceIds = deepbookBalanceManagers
      .map((bm) => bm.data?.content?.fields.balances.fields.id.id)
      .filter((b) => b !== null) as string[];
    if (balanceIds.length) {
      const balances = (
        await multipleGetDynamicFieldsObjectsSafe<{ value: string }>(
          client,
          balanceIds
        )
      ).flat();

      if (balances.length) {
        balances.forEach((balance) => {
          if (!balance.data?.content) return;
          const { keys } = parseTypeString(balance.data.type);
          if (!keys || !keys[0] || !keys[0].keys || !keys[0].keys[0]) return;
          element.addAsset({
            address: keys[0].keys[0].type,
            amount: balance.data.content.fields.value,
          });
        });
      }
    }
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-v3-deposits`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
