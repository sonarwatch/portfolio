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

const oneMonth = 30 * 24 * 60 * 60;

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
  const unvestedAmount = new BigNumber(res.data.totalAmount).minus(
    vestedAmount
  );

  const unlockedFromVesting = new BigNumber(
    getUnlockedAmountFromLinearVesting(
      1737201600,
      1752840000,
      vestedAmount,
      oneMonth
    )
  );

  const claimedAmount = new BigNumber(res.data.claimedAmount);

  let leftToClaim = new BigNumber(0);
  if (claimedAmount.isZero()) {
    leftToClaim = unvestedAmount.plus(unlockedFromVesting);
  } else if (claimedAmount.isGreaterThan(unvestedAmount)) {
    leftToClaim = claimedAmount.minus(unvestedAmount.plus(unlockedFromVesting));
  } else {
    leftToClaim = unvestedAmount.plus(unlockedFromVesting);
  }

  if (leftToClaim.dividedBy(res.data.totalAmount).isLessThan(0.05)) {
    leftToClaim = new BigNumber(0);
  }

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
        amount: leftToClaim.dividedBy(10 ** layerDecimals).toNumber(),
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
