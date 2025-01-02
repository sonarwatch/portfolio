import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { platformId, redeemTicketsKey } from './constants';
import { RedeemTicket } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const tickets = await cache.getItem<RedeemTicket[]>(redeemTicketsKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
  if (!tickets) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const withdrawElement = elementRegistry.addElementMultiple({
    label: 'LiquidityPool',
  });
  for (const ticket of tickets) {
    if (ticket.owner !== owner) continue;
    withdrawElement.addAsset({
      address: ticket.mint,
      amount: ticket.amount,
      attributes: {
        lockedUntil: ticket.lockUntil,
        tags: ['Pending Withdraw'],
      },
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-redeem-ticket`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
