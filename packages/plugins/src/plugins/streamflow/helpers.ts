import { AirdropRaw, NetworkIdType } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import {
  airdropApi,
  airdropStatics,
  merklePid,
  platformImg,
  streamMint,
} from './constants';
import { getAirdropRaw } from '../../AirdropFetcher';
import { AirdropResponse } from './types';
import { eligibleAddresses } from './airdropAddresses';

export function getPda(owner: string, distributor: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from([67, 108, 97, 105, 109, 83, 116, 97, 116, 117, 115]),
      new PublicKey(owner).toBuffer(),
      new PublicKey(distributor).toBuffer(),
    ],
    merklePid
  )[0];
}

export function getPdas(owner: string, distributors: string[]): PublicKey[] {
  return distributors.map(
    (dis) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from([67, 108, 97, 105, 109, 83, 116, 97, 116, 117, 115]),
          new PublicKey(owner).toBuffer(),
          new PublicKey(dis).toBuffer(),
        ],
        merklePid
      )[0]
  );
}

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
          imageUri: platformImg,
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
          imageUri: platformImg,
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
          imageUri: platformImg,
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
        imageUri: platformImg,
      },
    ],
  });
}
