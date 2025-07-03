import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { AirdropS3Response } from './types';
import {
  airdropS3Url,
  airdropStaticsS3,
  distributorS3Pid,
  driftMint,
} from './constants';
import { driftFactor } from './helpersAirdrop';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';

const fetchAirdropExecutor: AirdropFetcherExecutor = async (owner: string) => {
  const res: AxiosResponse<AirdropS3Response> = await axios.get(
    airdropS3Url + owner,
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
    return getAirdropRaw({
      statics: airdropStaticsS3,
      items: [
        {
          amount: 0,
          label: 'DRIFT',
          address: driftMint,
          isClaimed: false,
        },
      ],
    });
  }

  const availableAmount =
    Date.now() > res.data.end_ts * 1000
      ? res.data.end_amount
      : res.data.start_amount;

  const amount = new BigNumber(availableAmount || 0)
    .dividedBy(driftFactor)
    .toNumber();
  const merkle = res.data.merkle_tree;
  const isClaimed = res.data.claimed_amount !== 0;

  const claimStatus = deriveClaimStatus(owner, merkle, distributorS3Pid);
  const claims = await getClaimTransactions(owner, claimStatus, driftMint);

  return getAirdropRaw({
    statics: airdropStaticsS3,
    items: [
      {
        amount,
        label: 'DRIFT',
        address: driftMint,
        isClaimed,
        claims,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStaticsS3.id,
  networkId: NetworkId.solana,
  executor: fetchAirdropExecutor,
};
