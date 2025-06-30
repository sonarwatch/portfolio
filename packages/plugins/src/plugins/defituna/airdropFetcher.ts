import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStatics, apiUrl, tunaMint } from './constants';

import { AirdropApiResponse } from './types';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  // const client = getClientSolana();
  const res: AxiosResponse<AirdropApiResponse> | null = await axios
    .get(apiUrl + owner, { timeout: 3000 })
    .catch(() => null);
  // const claimStatus = deriveClaimStatus(owner, merkleTree, merkleDistributor);
  // const claimAccount = await getParsedAccountInfo(
  //   client,
  //   claimStatusStruct,
  //   claimStatus
  // );

  if (!res) {
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'TUNA',
          address: tunaMint,
        },
      ],
    });
  }
  // const claims = await getClaimTransactions(owner, claimStatus, jtoMint);

  const amount =
    res.data.data.lending + res.data.data.trade + res.data.data.trumped;

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount,
        isClaimed: false,
        label: 'TUNA',
        address: tunaMint,
      },
    ],
  });
};

export const tunaAirdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
