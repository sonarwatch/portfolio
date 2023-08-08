import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { topTokensPrefix } from './constants';
import { coingeckoCoinsListUrl } from '../../utils/coingecko/constants';
import { CoingeckoCoinsListResponse } from '../../utils/coingecko/types';
import sleep from '../../utils/misc/sleep';
import getTopAddresses from './getTopAddresses';

const networkIds = [NetworkId.ethereum, NetworkId.polygon, NetworkId.avalanche];

const executor: JobExecutor = async (cache: Cache) => {
  const coingeckoCoinsListRes: AxiosResponse<CoingeckoCoinsListResponse> | null =
    await axios
      .get(coingeckoCoinsListUrl, {
        params: {
          include_platform: 'true',
        },
        timeout: 5000,
      })
      .catch(() => null);
  await sleep(20000);
  if (!coingeckoCoinsListRes || !coingeckoCoinsListRes.data) return;

  for (let i = 0; i < networkIds.length; i++) {
    await sleep(10000);
    const networkId = networkIds[i];
    try {
      const topTokens = await getTopAddresses(
        networkId,
        coingeckoCoinsListRes.data
      );
      await cache.setItem(networkId, topTokens, {
        prefix: topTokensPrefix,
      });
    } catch (error) {
      //
    }
  }
};

const job: Job = {
  id: 'top-tokens',
  executor,
};
export default job;
