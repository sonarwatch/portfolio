import { NetworkId } from '@sonarwatch/portfolio-core';
import { Transaction } from '@mysten/sui/transactions';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  devInspectTxSender,
  limitPackageId,
  limitUserIndexId,
  platformId,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { LimitOrder } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { multipleGetDynamicFieldsObjectsSafe } from '../../utils/sui/multipleGetDynamicFieldsObjectsSafe';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { extractStructTagFromType } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const tx = new Transaction();
  tx.moveCall({
    target: `${limitPackageId}::limit_order::get_orders_indexer_by_owner`,
    arguments: [tx.pure.address(owner), tx.object(limitUserIndexId)],
    typeArguments: [],
  });

  const dir = await client.devInspectTransactionBlock({
    sender: devInspectTxSender,
    transactionBlock: tx,
  });

  if (!dir.events.length) return [];

  const ordersTableIds = dir.events.map(
    (e) => (e.parsedJson as { orders_table_id: string }).orders_table_id
  );

  const fields = await multipleGetDynamicFieldsObjectsSafe(
    client,
    ordersTableIds
  );

  if (!fields.length) return [];

  const orders = await multiGetObjects<LimitOrder>(
    client,
    fields.flat().map((o) => (o.data?.content?.fields as { name: string }).name)
  );

  if (!orders.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: `Limit Orders`,
  });

  orders.forEach((order) => {
    if (!order.data?.content) return;
    if (order.data.content.fields.pay_balance === '0') return;
    const structTag = extractStructTagFromType(order.data.type);

    element.addAsset({
      address: structTag.type_arguments[0],
      amount: order.data.content.fields.pay_balance,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-limit`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
