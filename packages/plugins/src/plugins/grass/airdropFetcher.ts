import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropApi, airdropStatics, grassMint, platform } from './constants';
import { AirdropResponse } from './types';
import { getClientSolana } from '../../utils/clients';
import { deriveClaimStatus } from './helpers';

const distributor = '6op4vvD7he9Nqs6eXCQvRmDtGYzMkRoDYcFUfF7pK5YS';
const executor: AirdropFetcherExecutor = async (owner: string) => {
  const walletAddress = owner;
  const input = JSON.stringify({ walletAddress }); // {"walletAddress":"..."}

  const encodedInput = encodeURIComponent(input);
  const res: AxiosResponse<AirdropResponse> = await axios.get(
    airdropApi + encodedInput
  );

  if (!res.data.result.data)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'GRASS',
          address: grassMint,
        },
      ],
    });

  let amount = 0;
  for (const key in res.data.result.data) {
    if (res.data.result.data[key]) {
      amount += res.data.result.data[key];
    }
  }

  const client = getClientSolana();
  const claimStatus = deriveClaimStatus(owner, distributor);
  const claimAccount = await client.getAccountInfo(claimStatus);

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      { amount, isClaimed: !!claimAccount, label: 'GRASS', address: grassMint },
    ],
  });
};

export const s1AirdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
export const s1Fetcher = airdropFetcherToFetcher(
  s1AirdropFetcher,
  platform.id,
  'grass-airdrop',
  airdropStatics.claimEnd
);
