import { Claim, ClientType, NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  airdropApi,
  airdropStatics,
  distributorPid,
  humaMint,
  platformId,
} from './constants';
import { AirdropResponse } from './types';
import { getClientSolana } from '../../utils/clients';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  try {
    const res: AxiosResponse<AirdropResponse> = await axios.get(
      airdropApi + owner
    );

    if (!res.data)
      return getAirdropRaw({
        statics: airdropStatics,
        items: [
          {
            amount: 0,
            isClaimed: false,
            label: 'HUMA',
            address: humaMint,
          },
        ],
      });

    const client = getClientSolana({ clientType: ClientType.SLOW });
    const claimStatus = deriveClaimStatus(
      owner,
      res.data.distributorPubkey,
      distributorPid
    );
    const claimAccount = await client.getAccountInfo(claimStatus);

    let claims: Claim[] = [];
    if (claimAccount) {
      claims = await getClaimTransactions(owner, claimStatus, humaMint);
    }

    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: res.data.amountUnlocked / 1000000,
          isClaimed: !!claimAccount,
          label: 'HUMA',
          address: humaMint,
          claims,
          ref: claimAccount ? claimStatus.toString() : undefined,
        },
      ],
    });
  } catch (err) {
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'HUMA',
          address: humaMint,
        },
      ],
    });
  }
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  'huma-airdrop',
  airdropStatics.claimEnd
);
