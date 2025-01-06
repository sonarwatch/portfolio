import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { addressEndpoint, addressKey, addressPrefix } from '../constants';
import { Cache } from '../../../Cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryAddress = async (cache: Cache): Promise<any> => {
  const resp = await axios.get(addressEndpoint);

  if (!resp.data) return undefined;

  await cache.setItem(
    addressKey,
    {
      ...resp.data,
    },
    {
      prefix: addressPrefix,
      networkId: NetworkId.sui,
    }
  );

  return resp.data;
};

export default queryAddress;
