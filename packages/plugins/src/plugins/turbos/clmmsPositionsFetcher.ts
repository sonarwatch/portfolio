import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { packageIdOriginal, platformId } from './constants';
import { getClientSui } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const ownerRes = await client.getOwnedObjects({
    owner,
    options: {
      showType: true,
      showContent: true,
      showDisplay: true,
      showOwner: true,
    },
    filter: { Package: packageIdOriginal },
  });
  if (!ownerRes.data) return [];
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-clmms-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
