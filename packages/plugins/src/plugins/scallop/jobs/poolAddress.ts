import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { PoolAddress } from '../types';
import { poolAddressEndpoint, poolAddressKey, poolAddressPrefix } from '../constants';
import { Cache } from '../../../Cache';

const queryPoolAddress = async (
  cache: Cache
): Promise<PoolAddress | undefined> => {
  const resp = await axios.get(poolAddressEndpoint);

  if (!resp.data) return undefined;

  await cache.setItem(
    poolAddressPrefix,
    {
      ...resp.data,
    },
    {
      prefix: poolAddressKey,
      networkId: NetworkId.sui,
    }
  );

  return resp.data;
};

export default queryPoolAddress;
