import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { NetworkId, getAirdropStatus } from '@sonarwatch/portfolio-core';
import {
  airdropUrl,
  driftDecimals,
  platformImage,
  platformName,
  platformWebsite,
} from './constants';
import { AirdropResponse } from './types';
import { AirdropFetcher, AirdropFetcherExecutor } from '../../AirdropFetcher';

const driftFactor = new BigNumber(10 ** driftDecimals);
export async function fetchAirdropAmount(owner: string) {
  const res: AxiosResponse<AirdropResponse> = await axios.get(
    airdropUrl + owner,
    {
      headers: {
        Origin: 'https://drift.foundation',
        Referer: 'https://drift.foundation/',
      },
      timeout: 1000,
      validateStatus(status) {
        return status === 404 || status === 200;
      },
    }
  );
  return new BigNumber(res.data.start_amount || 0)
    .dividedBy(driftFactor)
    .toNumber();
}

const airdropStatics = {
  claimLink: 'https://drift.foundation/eligibility',
  id: 'drift-airdrop-1',
  image: platformImage,
  label: 'DRIFT',
  name: undefined,
  organizerName: platformName,
  organizerLink: platformWebsite,
  claimStart: undefined,
  claimEnd: undefined,
};
const fetchAirdropExecutor: AirdropFetcherExecutor = async (owner: string) => {
  const amount = await fetchAirdropAmount(owner);
  return {
    ...airdropStatics,
    amount,
    ...getAirdropStatus(
      airdropStatics.claimStart,
      airdropStatics.claimEnd,
      amount
    ),
    price: null,
  };
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor: fetchAirdropExecutor,
};
