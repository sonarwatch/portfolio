import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { asr1Statics, asrApi, jupDisProgram } from './constants';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../../AirdropFetcher';
import { AsrResponse, ClaimProof } from '../types';
import { getMultipleAccountsInfoSafe } from '../../../utils/solana/getMultipleAccountsInfoSafe';
import { getClientSolana } from '../../../utils/clients';
import { jupMint, lfgDisProgram } from '../launchpad/constants';
import { deriveClaimStatus } from '../../../utils/solana/jupiter/deriveClaimStatus';

const asr1Items = new Map([
  [jupMint, { label: 'JUP', decimals: 6 }],
  [
    'ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq',
    { label: 'ZEUS', decimals: 6 },
  ],
  [
    'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',
    { label: 'WEN', decimals: 5 },
  ],
  [
    'UPTx1d24aBWuRgwxVnFmX4gNraj3QGFzL3QqBgxtWQG',
    { label: 'UPT', decimals: 9 },
  ],
  [
    'SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s',
    { label: 'SHARK', decimals: 6 },
  ],
]);
const ineligibleItems = Array.from(asr1Items).map(([address, { label }]) => ({
  amount: 0,
  label,
  address,
  isClaimed: false,
}));

function asrDeriveClaimStatus(claimant: string, claimProof: ClaimProof) {
  if (claimProof.mint === jupMint) {
    return deriveClaimStatus(claimant, claimProof.merkle_tree, jupDisProgram);
  }
  return deriveClaimStatus(claimant, claimProof.merkle_tree, lfgDisProgram);
}

const fetchAirdropExecutor: AirdropFetcherExecutor = async (owner: string) => {
  const claimsProof: AxiosResponse<AsrResponse> | null = await axios
    .get(`${asrApi}/${owner}`, { timeout: 5000 })
    .catch(() => {
      throw new Error('Failed to get asr claim proof');
    });
  if (
    !claimsProof ||
    !claimsProof.data.claim ||
    claimsProof.data.claim.length === 0
  )
    return getAirdropRaw({
      statics: asr1Statics,
      items: ineligibleItems,
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
    statics: asr1Statics,
    items: claimAccounts
      .map((claimAcc, i) => {
        const claimProofRes = claimsProof.data.claim[i];
        if (!claimProofRes.mint) return [];
        const asrItem = asr1Items.get(claimProofRes.mint);
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

const airdropFetcher: AirdropFetcher = {
  id: asr1Statics.id,
  networkId: NetworkId.solana,
  executor: fetchAirdropExecutor,
};

export default airdropFetcher;
