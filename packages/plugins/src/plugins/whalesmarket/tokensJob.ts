import axios, { AxiosResponse } from 'axios';
import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lastCountKey, platformId, tokensKey, whalesApi } from './constants';
import { TokensResponse } from './types';

const tokensToPrice = {
  CLOUD: { mint: 'CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu', decimals: 9 },
};

const minToTake = 200;
const executor: JobExecutor = async (cache: Cache) => {
  const lastCount = await cache.getItem<number>(lastCountKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  const apiRes: AxiosResponse<TokensResponse> | null = await axios
    .get(whalesApi, {
      params: { take: lastCount || minToTake, chain_id: 666666 },
    })
    .catch(() => null);
  if (!apiRes || !apiRes.data.data)
    throw new Error(
      `WhalesMarket Job : unable to reach the API : ${whalesApi}`
    );

  const tokens = apiRes.data.data.list;
  await cache.setItem(tokensKey, tokens, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  await cache.setItem(lastCountKey, apiRes.data.data.count, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  for (const [symbol, value] of Object.entries(tokensToPrice)) {
    const token = tokens.find((t) => t.symbol === symbol);
    if (token) {
      await cache.setTokenPriceSource({
        address: value.mint,
        decimals: value.decimals,
        weight: 0.001,
        id: platformId,
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        price: token.last_price,
        timestamp: Date.now(),
      });
    }
  }
};

const job: Job = {
  id: `${platformId}-tokens`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
