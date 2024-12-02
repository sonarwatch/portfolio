import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { dcaUserIndexerId, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { DcaOrder } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { extractStructTagFromType } from './helpers';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getDynamicFieldsSafe } from '../../utils/sui/getDynamicFieldsSafe';
import { ID } from '../../utils/sui/types/id';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const userIndexField = await getDynamicFieldObject(client, {
    parentId: dcaUserIndexerId,
    name: {
      type: 'address',
      value: owner,
    },
  });

  if (!userIndexField || userIndexField.error) return [];

  const fields = await getDynamicFieldsSafe(
    client,
    (userIndexField.data?.content?.fields as { value: { fields: { id: ID } } })
      .value.fields.id.id
  );

  if (!fields.length) return [];

  const orders = await multiGetObjects<DcaOrder>(
    client,
    fields.map((f) => f.name.value as string)
  );

  if (!orders.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: `DCA Orders`,
  });

  orders.forEach((order) => {
    if (!order.data?.content) return;
    const orderFields = order.data.content.fields;
    if (
      orderFields.in_withdrawn !== '0' &&
      orderFields.in_withdrawn === orderFields.in_deposited
    )
      return; // Close
    if (orderFields.in_withdrawn !== '0' && orderFields.out_withdrawn !== '0')
      return; // PartialDeal
    if (
      orderFields.amount_left_next_cycle === '0' &&
      orderFields.next_cycle_at === '0'
    )
      return; // AllDeal

    const structTag = extractStructTagFromType(order.data.type);

    if (order.data.content.fields.in_balance !== '0')
      element.addAsset({
        address: structTag.type_arguments[0],
        amount: order.data.content.fields.in_balance,
      });

    if (order.data.content.fields.out_balance !== '0')
      element.addAsset({
        address: structTag.type_arguments[1],
        amount: order.data.content.fields.out_balance,
      });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-dca`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
