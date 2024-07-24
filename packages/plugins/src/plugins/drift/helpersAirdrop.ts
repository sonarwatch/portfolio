import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  airdropStatics,
  airdropUrl,
  driftDecimals,
  driftMint,
} from './constants';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';

const driftFactor = new BigNumber(10 ** driftDecimals);
type AirdropInfo = {
  merkle?: string;
  amount: number;
  isClaimed: boolean;
};
type AirdropResponse = {
  claimant: string;
  merkle_tree: string;
  mint: string;
  start_ts: number;
  end_ts: number;
  start_amount: number;
  end_amount: number;
  unvested_amount: number;
  claimed_amount: number;
  error: string;
};

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

  if (res.data.error) {
    return { amount: 0, merkle: undefined, isClaimed: false };
  }

  const availableAmount =
    Date.now() > res.data.end_ts * 1000
      ? res.data.end_amount
      : res.data.start_amount;

  return {
    amount: new BigNumber(availableAmount || 0)
      .dividedBy(driftFactor)
      .toNumber(),
    merkle: res.data.merkle_tree,
    isClaimed: res.data.claimed_amount !== 0,
  };
}

const fetchAirdropExecutor: AirdropFetcherExecutor = async (owner: string) => {
  const airdropInfo = await fetchAirdropInfo(owner);
  const { isClaimed, amount } = airdropInfo;

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount,
        label: 'DRIFT',
        address: driftMint,
        isClaimed,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor: fetchAirdropExecutor,
};
