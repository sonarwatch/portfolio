import { NetworkId, PortfolioAsset } from '@sonarwatch/portfolio-core';
import request, { gql } from 'graphql-request';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { distributors, graphqlApi, platformId, zexMint } from './constants';
import { GQLResponse } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getClientSolana } from '../../utils/clients';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { deriveZetaClaimStatuses } from './helpers';

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

const networkId = NetworkId.solana;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
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

  if (!res) return [];

  const amount = res.getAirdropFinalFrontend.total_allocation;

  if (amount === 0) return [];

  const claimStatuses = deriveZetaClaimStatuses(owner, distributors);

  const client = getClientSolana();
  const claimStatusesAccount = await getMultipleAccountsInfoSafe(
    client,
    claimStatuses
  );

  if (claimStatusesAccount.some((account) => account)) return [];

  const tokenPrice = await cache.getTokenPrice(zexMint, networkId);
  const asset: PortfolioAsset = tokenPrice
    ? tokenPriceToAssetToken(
        tokenPrice.address,
        amount,
        networkId,
        tokenPrice,
        undefined,
        { lockedUntil: 1719475200000 }
      )
    : {
        type: 'generic',
        imageUri:
          'https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/ZEXy1pqteRu3n13kdyh4LwPQknkFk3GzmMYMuNadWPo.webp',
        data: {
          address: zexMint,
          amount,
          price: null,
          name: 'ZEX',
        },
        value: null,
        networkId,
        attributes: { lockedUntil: 1719475200000 },
      };

  return [
    {
      type: 'multiple',
      label: 'Airdrop',
      networkId,
      platformId,
      data: {
        assets: [asset],
      },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId,
  executor,
};

export default fetcher;
