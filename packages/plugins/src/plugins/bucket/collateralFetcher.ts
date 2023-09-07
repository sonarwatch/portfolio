import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { collaterals, platformId } from './constants';
import { getClientSui } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  for (const collateral of collaterals) {
    const positionData = await client.getDynamicFieldObject({
      parentId: collateral.parentId,
      name: owner,
    });
    if (!positionData.data) continue;

    const tokenPrice = await cache.getTokenPrice(
      collateral.tokenId,
      NetworkId.sui
    );
    if (!tokenPrice) continue;
  }
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-collateral`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
