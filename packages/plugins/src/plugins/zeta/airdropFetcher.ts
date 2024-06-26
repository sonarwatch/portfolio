import { NetworkId, PortfolioAsset } from '@sonarwatch/portfolio-core';
import request, { gql } from 'graphql-request';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { graphqlApi, platformId, zexMint } from './constants';
import { GQLResponse } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

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
        data: {
          address: zexMint,
          imageUri:
            'https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f7a6574616d61726b6574732f6272616e642f6d61737465722f6173736574732f7a6574612e706e67',
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
