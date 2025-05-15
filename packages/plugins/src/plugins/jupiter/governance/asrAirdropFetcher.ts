import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { AsrConfig, AsrItems, jupDisProgram } from './constants';
import { AirdropFetcherExecutor, getAirdropRaw } from '../../../AirdropFetcher';
import { AsrResponse, ClaimProof } from '../types';
import { getMultipleAccountsInfoSafe } from '../../../utils/solana/getMultipleAccountsInfoSafe';
import { getClientSolana } from '../../../utils/clients';
import { lfgDisProgram } from '../launchpad/constants';
import { deriveClaimStatus } from '../../../utils/solana/jupiter/deriveClaimStatus';
import { jupMint } from '../constants';

function getInegibleItems(items: AsrItems) {
  return Array.from(items).map(([address, { label }]) => ({
    amount: 0,
    label,
    address,
    isClaimed: false,
  }));
}

function asrDeriveClaimStatus(
  claimant: string,
  claimProof: ClaimProof,
  distributorProgram?: string
) {
  if (distributorProgram) {
    return deriveClaimStatus(
      claimant,
      claimProof.merkle_tree,
      distributorProgram
    );
  }
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
      asrDeriveClaimStatus(owner, cp, config.distributorProgram)
    );
    const client = getClientSolana();

    const claimAccounts = await getMultipleAccountsInfoSafe(
      client,
      claimAddresses
    );

    const txClaimAccounts = await Promise.all([
      ...claimAddresses.map((add) => client.getSignaturesForAddress(add)),
    ]);

    return getAirdropRaw({
      statics: config.statics,
      items: claimAccounts
        .map((claimAcc, i) => {
          const claimProofRes = claimsProof.data.claim[i];
          if (!claimProofRes.mint) return [];
          const asrItem = config.items.get(claimProofRes.mint);
          if (!asrItem) return [];

          const claimTx = txClaimAccounts[i][0];
          const { label, decimals } = asrItem;

          const amount = new BigNumber(claimProofRes.amount)
            .div(10 ** decimals)
            .toNumber();
          return [
            {
              amount,
              isClaimed: !!claimAcc,
              label,
              address: claimProofRes.mint,
              ref: claimAcc ? claimAddresses[i].toString() : undefined,
              claims:
                claimAcc && claimTx && claimTx.blockTime
                  ? [
                      {
                        date: claimTx.blockTime * 1000,
                        amount,
                        txId: claimTx.signature,
                      },
                    ]
                  : undefined,
            },
          ];
        })
        .flat(),
    });
  };
}
