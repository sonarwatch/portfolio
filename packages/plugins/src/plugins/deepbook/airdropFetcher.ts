import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStatics, deepDecimals, deepMint } from './constants';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { AirdropWrapperNFT } from '../../utils/sui/types';

const deepFactor = new BigNumber(10 ** deepDecimals);

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSui();
  const nfts = await getOwnedObjects<AirdropWrapperNFT>(client, owner, {
    filter: {
      StructType:
        '0x61c9c39fd86185ad60d738d4e52bd08bda071d366acde07e07c3916a2d75a816::distribution::DEEPWrapper',
    },
  });

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
// export const fetcher = airdropFetcherToFetcher(
//   airdropFetcher,
//   platform.id,
//   'deepbook-airdrop',
//   airdropStatics.claimEnd
// );
