import { NetworkId } from '@sonarwatch/portfolio-core';

import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../../../platforms';
import { getClientSei } from '../../../utils/clients';
import { getAllBalances } from '../../../utils/sei';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = await getClientSei();
  const balances = await getAllBalances(client.cosmos.bank.v1beta1, owner);
  return [];
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-sei`,
  networkId: NetworkId.sei,
  executor,
};

export default fetcher;
