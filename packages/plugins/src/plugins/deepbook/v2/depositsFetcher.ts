import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { PACKAGE_ID, poolsCacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSui } from '../../../utils/clients';
import { getUserPosition } from './helpers';
import { PoolSummary } from '../types';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { getOwnedObjectsPreloaded } from '../../../utils/sui/getOwnedObjectsPreloaded';
import { platformId } from '../constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const accountCaps = await getOwnedObjectsPreloaded(client, owner, {
    options: {
      showDisplay: true,
      showOwner: true,
    },
    filter: {
      MoveModule: {
        module: 'custodian_v2',
        package: PACKAGE_ID,
      },
    },
  });

  if (!accountCaps[0]?.data) return [];

  const accountCapId = accountCaps[0].data.objectId;

  const pools = await cache.getItem<PoolSummary[]>(poolsCacheKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });

  if (!pools) return [];

  const positions = await Promise.all(
    pools.map((pool) => getUserPosition(pool, accountCapId, client))
  );

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  pools.forEach((pool, i) => {
    if (!positions[i]) return;

    const poolPosition = positions[i];

    if (
      poolPosition.availableBaseAmount.isZero() &&
      poolPosition.lockedBaseAmount.isZero() &&
      poolPosition.availableQuoteAmount.isZero() &&
      poolPosition.lockedQuoteAmount.isZero()
    )
      return;

    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      name: 'V2',
    });

    element.addAsset({
      address: pool.baseAsset,
      amount: poolPosition.availableBaseAmount.plus(
        poolPosition.lockedBaseAmount
      ),
    });

    element.addAsset({
      address: pool.quoteAsset,
      amount: poolPosition.availableQuoteAmount.plus(
        poolPosition.lockedBaseAmount
      ),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-v2-deposits`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
