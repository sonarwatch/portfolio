import { Claim, ClientType, NetworkId } from '@sonarwatch/portfolio-core';
import { platformId, snsAirdropStatics, snsMint } from './constants';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { snsAllocation } from './SNS_allocation';
import { getClaimStatusPda } from './helpers';
import { getClientSolana } from '../../utils/clients';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const alloc = snsAllocation[owner];
  if (!alloc) {
    return getAirdropRaw({
      statics: snsAirdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'SNS',
          address: snsMint,
          imageUri: snsAirdropStatics.image,
        },
      ],
    });
  }

  const claimStatus = getClaimStatusPda(owner);
  const claimAccount = await getClientSolana({
    clientType: ClientType.SLOW,
  }).getAccountInfo(claimStatus);

  let claims: Claim[] = [];
  if (claimAccount) {
    claims = await getClaimTransactions(owner, claimStatus, snsMint);
  }

  return getAirdropRaw({
    statics: snsAirdropStatics,
    items: [
      {
        amount: alloc,
        isClaimed: !!claimAccount,
        label: 'SNS',
        address: snsMint,
        imageUri: snsAirdropStatics.image,
        claims,
        ref: claimAccount ? claimStatus.toString() : undefined,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: snsAirdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  snsAirdropStatics.id,
  snsAirdropStatics.claimEnd
);
