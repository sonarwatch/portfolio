import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSui } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const infos = client.getDynamicFieldObject({
    parentId:
      '0xb8c5eab02a0202f638958cc79a69a2d30055565caad1684b3c8bbca3bddcb322',
    name: '',
  });
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-collateral`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
