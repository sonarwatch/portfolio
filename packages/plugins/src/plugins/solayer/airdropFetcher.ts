import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  airdropApi,
  airdropStatics,
  layerDecimals,
  layerMint,
  platform,
} from './constants';
import { AirdropResponse } from './types';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  let res: AxiosResponse<AirdropResponse>;
  try {
    res = await axios.get(airdropApi + owner);
  } catch (err) {
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'LAYER',
          address: layerMint,
        },
      ],
    });
  }

  if (!res.data || res.data.totalAmount === '0')
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'LAYER',
          address: layerMint,
        },
      ],
    });

  const amount = BigNumber(res.data.totalAmount);
  const isFullyClaimed = amount.isEqualTo(Number(res.data.claimedAmount));

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: isFullyClaimed
          ? amount.dividedBy(10 ** layerDecimals).toNumber()
          : amount
              .minus(res.data.claimedAmount)
              .dividedBy(10 ** layerDecimals)
              .toNumber(),
        isClaimed: isFullyClaimed,
        label: 'LAYER',
        address: layerMint,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platform.id,
  'solayer-airdrop',
  airdropStatics.claimEnd
);
