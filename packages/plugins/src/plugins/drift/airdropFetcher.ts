import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { airdropUrl, driftDecimals, platform, platformId } from './constants';
import { AirdropResponse } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const driftFactor = new BigNumber(10 ** driftDecimals);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const res: AxiosResponse<AirdropResponse> | null = await axios
    .get(airdropUrl + owner, {
      headers: {
        Origin: 'https://drift.foundation',
        Referer: 'https://drift.foundation/',
      },
      timeout: 1000,
    })
    .catch(() => null);

  if (!res || res.data.error || res.data.start_amount === 0) return [];

  // const client = getClientSolana();
  // const claimStatus = deriveClaimStatus(owner, res.data.merkle_tree, '');
  // const account = await client.getAccountInfo(claimStatus);
  // if (account) return [];

  const { mint } = res.data;
  const tokenPrice =
    mint !== solanaNativeAddress
      ? await cache.getTokenPrice(res.data.mint, NetworkId.solana)
      : undefined;

  const amount = new BigNumber(res.data.start_amount)
    .dividedBy(driftFactor)
    .toNumber();

  const asset: PortfolioAsset = tokenPrice
    ? tokenPriceToAssetToken(
        tokenPrice.address,
        amount,
        NetworkId.solana,
        tokenPrice
      )
    : {
        type: 'generic',
        data: {
          amount,
          name: 'DRIFT',
          price: null,
          imageUri: platform.image,
        },
        attributes: {
          lockedUntil: -1,
        },
        networkId: NetworkId.solana,
        value: null,
      };

  return [
    {
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.multiple,
      data: {
        assets: [asset],
      },
      value: null,
      label: 'Airdrop',
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
