import axios, { AxiosResponse } from 'axios';
import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { PtToken } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res: AxiosResponse<{
    data: PtToken[];
  }> = await axios.post('https://api.rate-x.io', {
    serverName: 'AdminSvr',
    method: 'queryPTPrice',
    content: {},
  });

  const tokenPriceSources: TokenPriceSource[] = [];

  res.data.data.forEach((ptToken) => {
    const tokenPriceSource: TokenPriceSource = {
      address: ptToken.pt_mint,
      decimals: 9,
      id: ptToken.pt_mint,
      networkId: NetworkId.solana,
      platformId,
      price: ptToken.pt_u_price,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Earn',
      label: 'Staked',
    };

    tokenPriceSources.push(tokenPriceSource);
  });

  await cache.setTokenPriceSources(tokenPriceSources);
};

const job: Job = {
  id: `${platformId}-pt-prices`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
