// import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { PoolAddressMap } from '../types';
import {
  // poolAddressEndpoint,
  poolAddressKey,
  poolAddressPrefix,
} from '../constants';
import { Cache } from '../../../Cache';
import { POOL_ADDRESSES } from '../const/poolAddress';

const queryPoolAddress = async (
  cache: Cache
): Promise<PoolAddressMap | undefined> => {
  // @TODO: enable on prod
  // const resp = await axios.get(poolAddressEndpoint);
  // if (!resp.data) return undefined;

  // temporary solution
  const resp = { data: POOL_ADDRESSES };

  // modify so that instead of Record<coinName, PoolInfoAddresses>, it's Record<coinType, PoolInfoAddresses>
  const modifiedPoolAddress = Object.values(resp.data as PoolAddressMap).reduce(
    (acc, poolAddress) => {
      acc[poolAddress.coinType] = poolAddress;
      return acc;
    },
    {} as PoolAddressMap
  );

  await cache.setItem(poolAddressKey, modifiedPoolAddress, {
    prefix: poolAddressPrefix,
    networkId: NetworkId.sui,
  });

  return modifiedPoolAddress;
};

export default queryPoolAddress;
