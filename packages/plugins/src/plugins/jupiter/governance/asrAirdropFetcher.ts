import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { AsrConfig, AsrItems, jupDisProgram } from './constants';
import { AirdropFetcherExecutor, getAirdropRaw } from '../../../AirdropFetcher';
import { AsrResponse, ClaimProof } from '../types';
import { getMultipleAccountsInfoSafe } from '../../../utils/solana/getMultipleAccountsInfoSafe';
import { getClientSolana } from '../../../utils/clients';
import { jupMint, lfgDisProgram } from '../launchpad/constants';
import { deriveClaimStatus } from '../../../utils/solana/jupiter/deriveClaimStatus';

function getInegibleItems(items: AsrItems) {
  return Array.from(items).map(([address, { label }]) => ({
    amount: 0,
    label,
    address,
    isClaimed: false,
  }));
}

function asrDeriveClaimStatus(claimant: string, claimProof: ClaimProof) {
  if (claimProof.mint === jupMint) {
    return deriveClaimStatus(claimant, claimProof.merkle_tree, jupDisProgram);
  }
  return deriveClaimStatus(claimant, claimProof.merkle_tree, lfgDisProgram);
}

export function getAsrAirdropExecutor(
  config: AsrConfig
): AirdropFetcherExecutor {
  return async (owner: string) => {
    const claimsProof: AxiosResponse<AsrResponse> | null = await axios
      .get(config.api(owner), { timeout: 5000 })
      .catch(() => {
        throw new Error('Failed to get asr claim proof');
      });
    if (
      !claimsProof ||
      !claimsProof.data.claim ||
      claimsProof.data.claim.length === 0
    )
      return getAirdropRaw({
        statics: config.statics,
        items: getInegibleItems(config.items),
      });

    const claimAddresses = claimsProof.data.claim.map((cp) =>
      asrDeriveClaimStatus(owner, cp)
    );
    const client = getClientSolana();

    const claimAccounts = await getMultipleAccountsInfoSafe(
      client,
      claimAddresses
    );

    return getAirdropRaw({
      statics: config.statics,
      items: claimAccounts
        .map((claimAcc, i) => {
          const claimProofRes = claimsProof.data.claim[i];
          if (!claimProofRes.mint) return [];
          const asrItem = config.items.get(claimProofRes.mint);
          if (!asrItem) return [];
          const { label, decimals } = asrItem;
          return [
            {
              amount: new BigNumber(claimProofRes.amount)
                .div(10 ** decimals)
                .toNumber(),
              isClaimed: !!claimAcc,
              label,
              address: claimProofRes.mint,
            },
          ];
        })
        .flat(),
    });
  };
}
