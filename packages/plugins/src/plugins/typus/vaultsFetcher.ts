import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { depositReceiptType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { DepositReceipt } from './types';
import { getDepositShares } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const objects = await getOwnedObjects<DepositReceipt>(client, owner, {
    filter: { StructType: depositReceiptType },
  });

  const receipts: string[] = [];
  const validObjects = objects
    .map((object) => {
      if (object.data) {
        receipts.push(object.data.objectId);
        return object;
      }
      return [];
    })
    .flat();

  const deposits = await getDepositShares(client, receipts);
  if (!deposits) return [];

  for (const deposit of deposits) {
    console.log('Deposit :', deposit);
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
