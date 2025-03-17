import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { CurveTokenPriceResponse } from './types';
import { Cache } from '../../Cache';

const executor: JobExecutor = async (cache: Cache) => {
  /**
   * @see https://api.curve.fi/v1/documentation/#/Tokens/get_getTokens_all__blockchainId_
   * Returns all tokens that can be found in Curve pools, on a specific chain.
   * Pools need at least $10k TVL for tokens to make this list.
   */
  const url = 'https://api.curve.fi/v1/getTokens/all/fraxtal';

  const { data } = await axios.get<CurveTokenPriceResponse>(url);

  const { tokens } = data.data;
  const { generatedTimeMs } = data;

  const sources = tokens.map((token) => ({
    address: token.address,
    decimals: token.decimals,
    id: platformId,
    networkId: NetworkId.fraxtal,
    platformId,
    price: token.usdPrice,
    timestamp: generatedTimeMs,
    weight: 1,
  }));
  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-fraxtal-token-prices`,
  executor,
  labels: ['normal'],
};
export default job;
