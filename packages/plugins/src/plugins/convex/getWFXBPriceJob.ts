import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { platformId, wFXBAddress } from './constants';
import { CurveTokenPriceResponse } from './types';
import { Cache } from '../../Cache';

const executor: JobExecutor = async (cache: Cache) => {
  const FXB20291231Address = '0xF1e2b576aF4C6a7eE966b14C810b772391e92153';
  /**
   * @see https://curve.fi/dex/#/fraxtal/pools/factory-stable-ng-23/deposit
   * getting price from the pool above FXB20291231 / frxUSD and using it
   * as the price for wFXB
   */
  const url =
    'https://prices.curve.fi/v1/ohlc/fraxtal/0xeE454138083b9B9714cac3c7cF12560248d76D6B';
  const end = Math.floor(Date.now() / 1000); // Current time in seconds
  const start = end - 2 * 24 * 60 * 60; // 2 days ago in seconds

  const { data } = await axios.get<CurveTokenPriceResponse>(url, {
    params: {
      main_token: '0xFc00000000000000000000000000000000000001', // frxUSD
      reference_token: FXB20291231Address,
      agg_number: 1,
      agg_units: 'day',
      start,
      end,
    },
  });

  const { close: closePrice } = data.data[data.data.length - 1];

  await cache.setTokenPriceSource({
    address: FXB20291231Address,
    decimals: 18,
    id: platformId,
    networkId: NetworkId.fraxtal,
    platformId,
    price: closePrice,
    timestamp: Date.now(),
    weight: 1,
  });
  await cache.setTokenPriceSource({
    address: wFXBAddress,
    decimals: 18,
    id: platformId,
    networkId: NetworkId.fraxtal,
    platformId,
    price: closePrice,
    timestamp: Date.now(),
    weight: 1,
  });
};

const job: Job = {
  id: `${platformId}-fraxtal-wfxb`,
  executor,
  label: 'normal',
};
export default job;
