import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { topTokensPrefix } from './constants';
import { coingeckoCoinsListUrl } from '../../utils/coingecko/constants';
import { CoingeckoCoinsListResponse } from '../../utils/coingecko/types';
import sleep from '../../utils/misc/sleep';
import getTopAddresses from './getTopAddresses';

const networkIds = [
  NetworkId.avalanche,
  NetworkId.polygon,
  NetworkId.ethereum,
  NetworkId.bnb,
];

const executor: JobExecutor = async (cache: Cache) => {
  const coingeckoCoinsListRes: AxiosResponse<CoingeckoCoinsListResponse> | null =
    await axios
      .get(coingeckoCoinsListUrl, {
        params: {
          include_platform: 'true',
        },
        timeout: 8000,
      })
      .catch(async () => {
        await sleep(300000);
        return null;
      });
  await sleep(60000);
  if (!coingeckoCoinsListRes || !coingeckoCoinsListRes.data) return;

  for (let i = 0; i < networkIds.length; i++) {
    await sleep(60000);
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
  await sleep(60000);
};

const job: Job = {
  id: 'top-tokens',
  networkIds,
  executor,
  labels: ['coingecko', 'evm', NetworkId.bnb],
};
export default job;
