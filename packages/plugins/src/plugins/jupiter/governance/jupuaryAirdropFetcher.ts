import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../../AirdropFetcher';

import { jupMint } from '../launchpad/constants';
import { jupuaryStatics } from './constants';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const res = await fetch(
    `https://jupuary.jup.ag/api/allocation?wallet=${owner}`
  );
  const response: { data: { total_allocated: number } } = await res.json();

  return getAirdropRaw({
    statics: jupuaryStatics,
    items: [
      {
        amount: response.data.total_allocated,
        isClaimed: false,
        label: 'JUPUARY',
        address: jupMint,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: jupuaryStatics.id,
  networkId: NetworkId.solana,
  executor,
};
