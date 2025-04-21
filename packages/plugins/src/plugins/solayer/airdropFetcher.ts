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
  platformId,
} from './constants';
import { AirdropResponse } from './types';
import { getClientSolana } from '../../utils/clients';
import { getUnlockedAmountFromLinearVesting } from '../../utils/misc/getUnlockedAmountFromVesting';

const oneMonth = 30 * 24 * 60 * 60 * 1000;

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const epoch = await getClientSolana().getEpochInfo();
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

  const vestedAmount = new BigNumber(res.data.totalAmount).times(
    (epoch.epoch - res.data.startEpoch) /
      (res.data.endEpoch - res.data.startEpoch)
  );

  const availableToClaim = new BigNumber(
    getUnlockedAmountFromLinearVesting(
      1737201600000,
      1752840000000,
      vestedAmount.toNumber(),
      oneMonth
    )
  );

  const claimedAmount = new BigNumber(res.data.claimedAmount);

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: claimedAmount.dividedBy(10 ** layerDecimals).toNumber(),
        isClaimed: true,
        label: 'LAYER',
        address: layerMint,
      },
      {
        amount: availableToClaim.dividedBy(10 ** layerDecimals).toNumber(),
        isClaimed: false,
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
  platformId,
  'solayer-airdrop',
  airdropStatics.claimEnd
);
