import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { ClaimProofResponse } from '../types';
import { deriveClaimStatus } from '../helpers';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { claimStatusStruct } from './structs';
import {
  merkleApi,
  merkleDistributorPid,
  airdropsInfo,
  jupLaunchpadPlatformId,
  AirdropInfo,
} from './constants';
import { getParsedMultipleAccountsInfo } from '../../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const claimsProof: (AxiosResponse<ClaimProofResponse> | null)[] =
    await Promise.all(
      airdropsInfo.map((info) => {
        if (info.claimUntilTs > Date.now()) {
          return axios
            .get(`${merkleApi}/${info.mint}/${owner}`, { timeout: 1000 })
            .catch(() => null);
        }
        return null;
      })
    );

  const eligibleAirdrops: AirdropInfo[] = [];
  const proofs: ClaimProofResponse[] = [];
  for (let i = 0; i < claimsProof.length; i++) {
    const proof = claimsProof[i];
    if (!proof || !proof.data) continue;

    eligibleAirdrops.push(airdropsInfo[i]);
    proofs.push(proof.data);
  }

  if (proofs.length === 0) return [];

  const claimStatusAccounts = await getParsedMultipleAccountsInfo(
    client,
    claimStatusStruct,
    proofs.map(
      (proof) =>
        deriveClaimStatus(
          new PublicKey(owner),
          new PublicKey(proof.merkle_tree),
          merkleDistributorPid
        )[0]
    )
  );

  const tokenPriceById = await cache.getTokenPricesAsMap(
    eligibleAirdrops.map((info) => info.mint),
    NetworkId.solana
  );

  const assets: PortfolioAsset[] = [];
  for (let j = 0; j < claimStatusAccounts.length; j++) {
    const claimStatus = claimStatusAccounts[j];
    if (claimStatus) continue;

    const proof = proofs[j];
    const { decimals, mint } = eligibleAirdrops[j];

    const tokenPrice = tokenPriceById.get(mint);

    const amount = new BigNumber(proof.amount)
      .dividedBy(10 ** decimals)
      .toNumber();
    const asset = tokenPriceToAssetToken(
      mint,
      amount,
      NetworkId.solana,
      tokenPrice,
      undefined,
      { isClaimable: true }
    );

    assets.push(asset);
  }

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Rewards',
      networkId: NetworkId.solana,
      platformId: jupLaunchpadPlatformId,
      name: 'Allocation',
      data: {
        assets,
      },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${jupLaunchpadPlatformId}-allocation`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
