import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSui } from '../../utils/clients';
import { getOrderCapInfoList, getOrderInfoList } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const orderCapInfoList = await getOrderCapInfoList(client, owner);

  if (!orderCapInfoList.length) return [];

  const positionInfoList = await getOrderInfoList(
    client,
    orderCapInfoList,
    owner
  );

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-orders`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
