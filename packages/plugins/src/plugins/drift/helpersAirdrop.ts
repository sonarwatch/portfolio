import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { NetworkId, getAirdropClaimStatus } from '@sonarwatch/portfolio-core';
import {
  airdropUrl,
  driftDecimals,
  platformImage,
  platformName,
  platformWebsite,
} from './constants';
import { AirdropInfo, AirdropResponse } from './types';
import { AirdropFetcher, AirdropFetcherExecutor } from '../../AirdropFetcher';

const driftFactor = new BigNumber(10 ** driftDecimals);
export const claimStart = 1715860800000;

export async function fetchAirdropInfo(owner: string): Promise<AirdropInfo> {
  const res: AxiosResponse<AirdropResponse> = await axios.get(
    airdropUrl + owner,
    {
      headers: {
        Origin: 'https://drift.foundation',
        Referer: 'https://drift.foundation/',
      },
      timeout: 4000,
      validateStatus(status) {
        return status === 404 || status === 200;
      },
    }
  );

  const availableAmount =
    Date.now() > res.data.end_ts * 1000
      ? res.data.end_amount
      : res.data.start_amount;

  return {
    amount: new BigNumber(availableAmount || 0)
      .dividedBy(driftFactor)
      .toNumber(),
    merkle: res.data.merkle_tree,
  };
}

const airdropStatics = {
  claimLink: 'https://drift.foundation/eligibility',
  id: 'drift-airdrop-1',
  image: platformImage,
  label: 'DRIFT',
  name: undefined,
  emitterName: platformName,
  emitterLink: platformWebsite,
  claimStart,
  claimEnd: undefined,
};
const fetchAirdropExecutor: AirdropFetcherExecutor = async (owner: string) => {
  let { amount } = await fetchAirdropInfo(owner);
  if (amount === 0) amount = -1;

  const claimStatus = getAirdropClaimStatus(
    airdropStatics.claimStart,
    airdropStatics.claimEnd
  );
  return {
    ...airdropStatics,
    amount,
    claimStatus,
    isClaimed: false,
    price: null,
  };
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor: fetchAirdropExecutor,
};
