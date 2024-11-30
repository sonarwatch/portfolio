import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStatics, deepDecimals, deepMint, platform } from './constants';
import { getClientSui } from '../../utils/clients';
import { AirdropWrapperNFT, DeepAirdropNFT } from '../../utils/sui/types';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const deepFactor = new BigNumber(10 ** deepDecimals);

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSui();
  const [nfts, claimed] = await Promise.all([
    getOwnedObjectsPreloaded<AirdropWrapperNFT>(client, owner, {
      filter: {
        StructType:
          '0x61c9c39fd86185ad60d738d4e52bd08bda071d366acde07e07c3916a2d75a816::distribution::DEEPWrapper',
      },
    }),
    getOwnedObjectsPreloaded<DeepAirdropNFT>(client, owner, {
      filter: {
        StructType:
          '0xc2cfa18b841df1887d931055cf41f2773c58164f719675595d020829893188a5::distribution::DEEPAirdrop',
      },
    }),
  ]);

  let amount;
  if (nfts.length !== 0) {
    const amounts = nfts.map((nft) => {
      if (nft.data?.content?.fields) {
        return BigNumber(nft.data.content.fields.balance);
      }
      return BigNumber(0);
    });
    amount = amounts
      .reduce((am, curr) => curr.plus(am), new BigNumber(0))
      .dividedBy(deepFactor)
      .toNumber();
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
        label: 'DEEP',
        address: deepMint,
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
  'deepbook-airdrop',
  airdropStatics.claimEnd
);
