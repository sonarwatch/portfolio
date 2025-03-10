import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { apiUrl, crownMint, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  let res;
  try {
    res = await axios.get(apiUrl + owner);
  } catch (err) {
    return [];
  }

  if (typeof res.data === 'string') return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  registry
    .addElementMultiple({
      label: 'Staked',
      link: 'https://photofinish.live/crown',
    })
    .addAsset({
      address: crownMint,
      amount: res.data,
      alreadyShifted: true,
    });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
