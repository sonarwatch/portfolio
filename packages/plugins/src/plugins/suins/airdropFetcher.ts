import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStatics, nsDecimals, nsMint, platform } from './constants';
import { getClientSui } from '../../utils/clients';
import { AirdropWrapperNFT } from '../../utils/sui/types';
import { NsAirdropClaimed } from './types';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const deepFactor = new BigNumber(10 ** nsDecimals);

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSui();
  const [nfts, claimed] = await Promise.all([
    getOwnedObjectsPreloaded<AirdropWrapperNFT>(client, owner, {
      filter: {
        StructType:
          '0x220bca2187856d09aae578e2782b2b484049a32c755d20352e01236ba5368b63::distribution::NSWrapper',
      },
    }),
    getOwnedObjectsPreloaded<NsAirdropClaimed>(client, owner, {
      filter: {
        StructType:
          '0x3ca2fdfc90c262f5a7323cdf10f4a8960a2640a18abc0c8405b15ad7186be8f0::distribution::NSAirdrop',
      },
    }),
  ]);

  let amount = 0;

  if (nfts) {
    const amounts = nfts.map((nft) => {
      if (nft.data?.content?.fields) {
        return BigNumber(nft.data.content.fields.balance)
          .dividedBy(deepFactor)
          .toNumber();
      }
      return 0;
    });
    amount = amounts.reduce((am, curr) => curr + am, 0);
  }

  let claimedAmount = 0;
  if (claimed) {
    const amounts = claimed.map((nft) => {
      if (nft.data?.content?.fields) {
        return BigNumber(nft.data.content.fields.amount);
      }
      return BigNumber(0);
    });
    claimedAmount = amounts
      .reduce((am, curr) => curr.plus(am), new BigNumber(0))
      .dividedBy(deepFactor)
      .toNumber();
  }

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: amount ?? claimedAmount,
        isClaimed: !!claimedAmount,
        label: 'NS',
        address: nsMint,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.sui,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platform.id,
  'ns-airdrop',
  airdropStatics.claimEnd
);
