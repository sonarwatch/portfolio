import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  jupDecimals,
  jupMint,
  merkleApi,
  merkleDistributorPid,
  platformId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { claimStatusStruct } from './structs';
import { ClaimProofResponse } from './types';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { deriveClaimStatus } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const claimProofRes: AxiosResponse<ClaimProofResponse> | null = await axios
    .get(merkleApi + owner)
    .catch(() => null);

  const jupTokenPrice = await cache.getTokenPrice(jupMint, NetworkId.solana);
  if (claimProofRes) {
    const claimStatus = deriveClaimStatus(
      new PublicKey(owner),
      new PublicKey(claimProofRes.data.merkle_tree),
      merkleDistributorPid
    )[0];
    const account = await getParsedAccountInfo(
      client,
      claimStatusStruct,
      claimStatus
    );
    if (!account) {
      const amount = new BigNumber(claimProofRes.data.amount)
        .dividedBy(10 ** jupDecimals)
        .toNumber();
      const asset = tokenPriceToAssetToken(
        jupMint,
        amount,
        NetworkId.solana,
        jupTokenPrice
      );
      return [
        {
          type: PortfolioElementType.multiple,
          label: 'Rewards',
          networkId: NetworkId.solana,
          platformId,
          name: 'Airdrop',
          data: {
            assets: [{ ...asset, attributes: { isClaimable: true } }],
          },
          value: asset.value,
        },
      ];
    }
    return [];
  }
  return [];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
