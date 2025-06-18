import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStaticsS3, kmnoMint, platformId } from './constants';
import { AllocationsApiRes } from './types';
import { getCachedClaims } from './airdropHelpers';

const statics = airdropStaticsS3;
const season = 3;

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const response = await axios.get<unknown, AxiosResponse<AllocationsApiRes>>(
    `https://api.hubbleprotocol.io/v2/airdrop/users/${owner}/allocations?source=Season${season}`,
    { timeout: 4000 }
  );

  const { quantity } = response.data.find(
    (i) => i.name === 'main_allocation'
  ) || { quantity: '0' };

  if (quantity === '0')
    return getAirdropRaw({
      statics,
      items: [
        {
          amount: Number(quantity),
          isClaimed: null,
          label: 'KMNO',
          address: kmnoMint,
        },
      ],
    });

  const claims = (await getCachedClaims(owner)).filter((claim) => {
    if (statics.claimStart && statics.claimStart > claim.date) {
      return false;
    }
    if (statics.claimEnd && statics.claimEnd < claim.date) {
      return false;
    }
    return true;
  });

  return getAirdropRaw({
    statics,
    items: [
      {
        amount: Number(quantity),
        isClaimed: claims.length > 0,
        label: 'KMNO',
        address: kmnoMint,
        claims,
      },
    ],
  });
};
const airdropFetcher: AirdropFetcher = {
  id: statics.id,
  networkId: NetworkId.solana,
  executor,
};

const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  `${platformId}-airdrop-s${season}`,
  statics.claimEnd
);

export { airdropFetcher, fetcher };
