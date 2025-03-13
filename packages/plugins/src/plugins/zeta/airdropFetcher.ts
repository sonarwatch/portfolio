import { NetworkId } from '@sonarwatch/portfolio-core';
import request, { gql } from 'graphql-request';
import {
  airdropStatics,
  distributors,
  graphqlApi,
  platform,
  zexMint,
} from './constants';
import { GQLResponse } from './types';
import { getClientSolana } from '../../utils/clients';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { deriveZetaClaimStatuses } from './helpers';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';

const query = gql`
  query GetAirdropFinalFrontend($authority: String!) {
    getAirdropFinalFrontend(authority: $authority) {
      authority
      community_allocation
      eligibility
      main_allocation
      og_allocation
      s1_allocation
      s2_allocation
      total_allocation
      __typename
    }
  }
`;

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const res = await request<GQLResponse>(
    graphqlApi,
    query,
    {
      authority: owner,
    },
    {
      origin: 'https://token.zeta.markets',
      referrer: 'https://token.zeta.markets/',
      'X-Api-Key': 'da2-rrupjjccivdndc6rvltixlmsma',
    }
  ).catch(() => null);
  if (!res || !res.getAirdropFinalFrontend)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'ZEX',
          address: zexMint,
        },
      ],
    });

  const amount = res.getAirdropFinalFrontend.total_allocation;
  if (!amount || amount === 0)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'ZEX',
          address: zexMint,
        },
      ],
    });

  const claimStatuses = deriveZetaClaimStatuses(owner, distributors);

  const client = getClientSolana();
  const claimStatusesAccount = await getMultipleAccountsInfoSafe(
    client,
    claimStatuses
  );

  if (claimStatusesAccount.some((account) => account))
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount,
          isClaimed: true,
          label: 'ZEX',
          address: zexMint,
        },
      ],
    });

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount,
        isClaimed: false,
        label: 'ZEX',
        address: zexMint,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platform.id,
  'zeta-airdrop',
  airdropStatics.claimEnd
);
