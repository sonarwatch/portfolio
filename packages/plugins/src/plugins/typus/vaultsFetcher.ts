import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { depositReceiptType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const objects = await getOwnedObjects(client, owner, {
    filter: { StructType: depositReceiptType },
  });

  for (const object of objects) {
    console.log('Version:', object.data?.content?.fields);
    console.log(`https://suivision.xyz/object/${object.data?.objectId}`);
  }

  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-vaults`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
