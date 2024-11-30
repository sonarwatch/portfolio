import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  airdropStatics,
  nsDecimals,
  nsMint,
  platform as suinsPlatform,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { AirdropWrapperNFT } from '../../utils/sui/types';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const deepFactor = new BigNumber(10 ** nsDecimals);

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSui();
  const nfts = await getOwnedObjectsPreloaded<AirdropWrapperNFT>(
    client,
    owner,
    {
      filter: {
        StructType:
          '0x220bca2187856d09aae578e2782b2b484049a32c755d20352e01236ba5368b63::distribution::NSWrapper',
      },
    }
  );

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
  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount,
        isClaimed: false,
        label: 'NS',
        address: nsMint,
        imageUri: nsMint ? undefined : suinsPlatform.image,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.sui,
  executor,
};
// export const fetcher = airdropFetcherToFetcher(
//   airdropFetcher,
//   platform.id,
//   'deepbook-airdrop',
//   airdropStatics.claimEnd
// );
