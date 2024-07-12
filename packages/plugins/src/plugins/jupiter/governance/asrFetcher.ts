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
import { AsrResponse } from '../types';
import { deriveClaimStatus } from '../../../utils/solana/jupiter/deriveClaimStatus';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { claimStatusStruct } from '../launchpad/structs';
import {
  asrApi,
  jupDisProgram,
  jupMint,
  mainDisProgram,
} from '../launchpad/constants';
import { platformId } from './constants';
import { getParsedMultipleAccountsInfo } from '../../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const claimsProof: AxiosResponse<AsrResponse> | null = await axios
    .get(`${asrApi}/${owner}`, { timeout: 1000 })
    .catch(() => null);

  if (!claimsProof?.data.claim) return [];

  const claims = claimsProof.data.claim;

  const claimsStatusPubkeys: PublicKey[] = [];
  for (let i = 0; i < claims.length; i++) {
    const proof = claims[i];
    if (proof.mint === jupMint) {
      claimsStatusPubkeys.push(
        deriveClaimStatus(owner, proof.merkle_tree, jupDisProgram)
      );
    } else {
      claimsStatusPubkeys.push(
        deriveClaimStatus(owner, proof.merkle_tree, mainDisProgram)
      );
    }
  }

  const [claimStatusAccounts, tokenPriceById] = await Promise.all([
    getParsedMultipleAccountsInfo(
      client,
      claimStatusStruct,
      claimsStatusPubkeys
    ),
    cache.getTokenPricesAsMap(
      claims.map((claim) => (claim.mint ? claim.mint : [])).flat(),
      NetworkId.solana
    ),
  ]);

  const assets: PortfolioAsset[] = [];
  for (let j = 0; j < claimStatusAccounts.length; j++) {
    const claimStatus = claimStatusAccounts[j];
    if (claimStatus) continue;

    const proof = claims[j];
    if (!proof.mint) continue;

    const tokenPrice = tokenPriceById.get(proof.mint);
    if (!tokenPrice) continue;

    const amount = new BigNumber(proof.amount)
      .dividedBy(10 ** tokenPrice.decimals)
      .toNumber();
    const asset = tokenPriceToAssetToken(
      proof.mint,
      amount,
      NetworkId.solana,
      tokenPrice
    );

    assets.push(asset);
  }

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Airdrop',
      networkId: NetworkId.solana,
      platformId,
      name: 'Active Staking Rewards',
      data: {
        assets,
      },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-asr`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
