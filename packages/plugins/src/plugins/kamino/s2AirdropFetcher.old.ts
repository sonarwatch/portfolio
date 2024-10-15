import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStaticsS2, kmnoMint, platform } from './constants';
import { AllocationsApiRes } from './types';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const response = await axios.get<unknown, AxiosResponse<AllocationsApiRes>>(
    `https://api.hubbleprotocol.io/v2/airdrop/users/${owner}/allocations?source=Season2`,
    { timeout: 4000 }
  );

  const { quantity } = response.data.find(
    (i) => i.name === 'main_allocation'
  ) || { quantity: '0' };

  return getAirdropRaw({
    statics: airdropStaticsS2,
    items: [
      {
        amount: Number(quantity),
        isClaimed: null,
        label: 'KMNO',
        address: kmnoMint,
      },
    ],
  });
};
const airdropFetcher: AirdropFetcher = {
  id: airdropStaticsS2.id,
  networkId: NetworkId.solana,
  executor,
};

const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platform.id,
  `${platform.id}-airdrop-s2`,
  airdropStaticsS2.claimEnd
);

export { airdropFetcher, fetcher };
