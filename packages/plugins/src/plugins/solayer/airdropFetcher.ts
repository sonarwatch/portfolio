import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
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

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSolana();
  const epoch = await client.getEpochInfo();

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

  const claimedAmount = new BigNumber(res.data.claimedAmount);
  const totalAmount = new BigNumber(res.data.totalAmount);
  const { startEpoch, endEpoch } = res.data;

  const txs = client.getSignaturesForAddress(
    new PublicKey('35YYQV8wTUWxKoyMSAzhLSshxYSuiWZmtnsb94asAZfk')
  );

  if (epoch.epoch >= startEpoch && endEpoch >= startEpoch) {
    const diffAirDropEpoch = endEpoch - startEpoch;
    const diffCurrentEpoch = epoch.epoch - startEpoch;

    const ratio = diffCurrentEpoch / diffAirDropEpoch;

    if (diffAirDropEpoch > 0 && diffCurrentEpoch > 0) {
      const availableAmount = totalAmount
        .times(ratio)
        .minus(claimedAmount)
        .decimalPlaces(0, BigNumber.ROUND_DOWN);

      return getAirdropRaw({
        statics: airdropStatics,
        items: [
          {
            amount: totalAmount.dividedBy(10 ** layerDecimals).toNumber(),
            isClaimed: false,
            label: 'LAYER',
            address: layerMint,
            claims: [
              {
                date: 0,
                amount: claimedAmount.dividedBy(10 ** layerDecimals).toNumber(),
              },
            ],
            ref: '35YYQV8wTUWxKoyMSAzhLSshxYSuiWZmtnsb94asAZfk',
          },
          // {
          //   amount: claimedAmount.dividedBy(10 ** layerDecimals).toNumber(),
          //   isClaimed: true,
          //   label: 'LAYER',
          //   address: layerMint,
          // },
        ],
      });
    }
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
