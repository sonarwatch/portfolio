import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import {
  addressEndpoint,
  addressPrefix as prefix,
  addressKey,
} from '../constants';
import { AddressInfo } from '../types';

const queryAddress = async (cache: Cache): Promise<AddressInfo | undefined> => {
  const resp = await axios.get(addressEndpoint);

  if (!resp.data) return undefined;
  const addressData = resp.data as AddressInfo;
  await cache.setItem(
    addressKey,
    {
      ...resp.data,
    },
    {
      prefix,
      networkId: NetworkId.sui,
    }
  );

  return addressData;
};
export default queryAddress;
