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
  asrApi,
  asrAirdropStatics,
  distributorPid,
  platformId,
  sCloudMint,
} from './constants';
import { AirdropResponse } from './types';
import { getClientSolana } from '../../utils/clients';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const res: AxiosResponse<AirdropResponse> | null = await axios
    .get(asrApi + owner, { timeout: 5000 })
    .catch(() => null);

  if (!res || res.data.error)
    return getAirdropRaw({
      statics: asrAirdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'CLOUD',
          address: sCloudMint,
        },
      ],
    });

  const client = getClientSolana();
  const claimStatus = deriveClaimStatus(
    owner,
    'F1kocmKzLCNURG67qnkBibGokkiQX6w3E1sn2dXr82wy',
    distributorPid.toString()
  );
  const claimAccount = await client.getAccountInfo(claimStatus);

  return getAirdropRaw({
    statics: asrAirdropStatics,
    items: [
      {
        amount: new BigNumber(res.data.amount).dividedBy(10 ** 9).toNumber(),
        isClaimed: !!claimAccount,
        label: 'CLOUD',
        address: sCloudMint,
      },
    ],
  });
};

export const asrAirdropFetcher: AirdropFetcher = {
  id: asrAirdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
export const asrFetcher = airdropFetcherToFetcher(
  asrAirdropFetcher,
  platformId,
  'sanctum-asr-airdrop',
  asrAirdropStatics.claimEnd
);
