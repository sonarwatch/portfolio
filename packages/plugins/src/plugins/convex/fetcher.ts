import {
  EvmNetworkIdType,
  PortfolioElementLiquidity,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import sleep from '../../utils/misc/sleep';

function fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (
    owner: string
    // cache: Cache
  ) => {
    await sleep(1000); // Simulating a delay for demonstration purposes
    console.log('This is a test of the convex fetcher', { owner, networkId });

    const element: PortfolioElementLiquidity = {
      networkId,
      platformId,
      label: 'Farming',
      type: PortfolioElementType.liquidity,
      data: {
        liquidities: [],
      },
      value: 0,
    };
    return [element];
  };

  return {
    id: `${platformId}-${networkId}`,
    networkId,
    executor,
  };
}

export default fetcher;
