import { AirdropRaw, NetworkIdType } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { airdropApi, airdropStatics, platform, streamMint } from './constants';
import { getAirdropRaw } from '../../AirdropFetcher';
import { AirdropResponse } from './types';
import { eligibleAddresses } from './airdropAddresses';

export function getAirdropApiUrlFromNetworkId(
  owner: string,
  networkId: NetworkIdType
): string | undefined {
  switch (networkId) {
    case 'aptos':
      return `${airdropApi}?address=${owner}&chain=Aptos`;
    case 'ethereum':
      return `${airdropApi}?address=${owner}&chain=Ethereum`;
    case 'solana':
      return `${airdropApi}?address=${owner}&chain=Solana`;
    case 'sui':
      return `${airdropApi}?address=${owner}&chain=Sui`;
    default:
      return undefined;
  }
}

function isElible(owner: string, networdkId: NetworkIdType) {
  return eligibleAddresses[networdkId]?.includes(owner);
}

export async function getAirdropItems(
  owner: string,
  networdkId: NetworkIdType
): Promise<AirdropRaw> {
  if (!isElible(owner, networdkId))
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'STREAM',
          address: streamMint,
          imageUri: platform.image,
        },
      ],
    });

  const link = getAirdropApiUrlFromNetworkId(owner, networdkId);

  if (!link)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'STREAM',
          address: streamMint,
          imageUri: platform.image,
        },
      ],
    });

  const res: AxiosResponse<AirdropResponse> = await axios.get(link);

  if (!res.data.isEligible)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'STREAM',
          address: streamMint,
          imageUri: platform.image,
        },
      ],
    });

  const amount = BigNumber(res.data.data.allocation)
    .dividedBy(10 ** 6)
    .toNumber();
  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount,
        isClaimed: false,
        label: 'STREAM',
        address: streamMint,
        imageUri: platform.image,
      },
    ],
  });
}
