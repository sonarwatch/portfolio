import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { jupApiParams } from '../jupiter/constants';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';
import { getClientSolana } from '../../utils/clients';
import { ClaimProofResponse } from '../jupiter/types';
import { lfgApiBaseUrl, lfgDisProgram } from '../jupiter/launchpad/constants';
import {
  s1AirdropStatics,
  cloudMint,
  cloudDecimals,
  platformId,
} from './constants';

const claimStart = new BigNumber(1721314800000);
const earnestClaimDuration = 172 * 24 * 60 * 60 * 1000;
const earnestClaimEnd = new BigNumber(1736208000000);
const capitalClaimDuration = 14 * 24 * 60 * 60 * 1000;
const capitalClaimEnd = claimStart.plus(capitalClaimDuration);

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const claimProofBase: AxiosResponse<ClaimProofResponse> | null = await axios
    .get(
      `${lfgApiBaseUrl}/CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu/${owner}?${
        jupApiParams ?? ''
      }`,
      {
        timeout: 5000,
      }
    )
    .catch((e) => {
      if (e.response && e.response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get base claim proof CLOUD`);
    });
  if (!claimProofBase || typeof claimProofBase.data === 'string')
    return getAirdropRaw({
      statics: s1AirdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'CLOUD',
          address: cloudMint,
        },
      ],
    });

  const client = getClientSolana();
  const claimStatusAddress = deriveClaimStatus(
    owner,
    claimProofBase.data.merkle_tree,
    lfgDisProgram
  );
  const claimStatusAccount = await client.getAccountInfo(claimStatusAddress);

  let capitalAmount = new BigNumber(0);
  let claimedTs;
  let firstTx;
  if (claimStatusAccount) {
    const txs = await client.getSignaturesForAddress(claimStatusAddress);
    [firstTx] = txs;
    claimedTs = firstTx.blockTime;
    if (claimedTs) {
      const ratio = new BigNumber(claimedTs * 1000)
        .minus(claimStart)
        .dividedBy(capitalClaimDuration)
        .plus(1);
      capitalAmount = new BigNumber(claimProofBase.data.amount).times(ratio);
    } else {
      capitalAmount = new BigNumber(claimProofBase.data.amount);
    }
  } else if (capitalClaimEnd.isLessThan(Date.now())) {
    capitalAmount = new BigNumber(claimProofBase.data.amount).times(2);
  } else {
    const ratio = new BigNumber(Date.now())
      .minus(claimStart)
      .dividedBy(earnestClaimDuration)
      .plus(1);
    capitalAmount = new BigNumber(claimProofBase.data.amount).times(ratio);
  }

  const items = [
    {
      amount: capitalAmount.div(10 ** cloudDecimals).toNumber(),
      isClaimed: claimStatusAccount !== null,
      label: 'CLOUD',
      address: cloudMint,
      claims:
        claimedTs && firstTx
          ? [
              {
                date: claimedTs,
                amount: capitalAmount.div(10 ** cloudDecimals).toNumber(),
                txId: firstTx.signature,
              },
            ]
          : undefined,
      ref: claimStatusAccount ? claimStatusAddress.toString() : undefined,
    },
  ];

  // Check Earnestness
  const claimProofEarn: AxiosResponse<ClaimProofResponse> | null = await axios
    .get(
      `${lfgApiBaseUrl}/earnestness-CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu/${owner}?${
        jupApiParams ?? ''
      }`,
      {
        timeout: 5000,
      }
    )
    .catch((e) => {
      if (e.response && e.response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get earnestness claim proof CLOUD`);
    });

  // If Earnestness elligible
  if (claimProofEarn && typeof claimProofEarn.data !== 'string') {
    const earnClaimStatusAddress = deriveClaimStatus(
      owner,
      claimProofEarn.data.merkle_tree,
      lfgDisProgram
    );
    const earnClaimStatusAccount = await client.getAccountInfo(
      earnClaimStatusAddress
    );

    let earnestAmount = new BigNumber(0);
    let earnestClaimTx;
    let earnestClaimTime;
    if (earnClaimStatusAccount) {
      const txs = await client.getSignaturesForAddress(earnClaimStatusAddress);
      [earnestClaimTx] = txs;
      earnestClaimTime = earnestClaimTx.blockTime;
      if (earnestClaimTime) {
        if (earnestClaimEnd.isLessThanOrEqualTo(earnestClaimTime * 1000))
          earnestAmount = new BigNumber(claimProofEarn.data.amount).times(2);
        else {
          const ratio = new BigNumber(earnestClaimTime * 1000)
            .minus(claimStart)
            .dividedBy(earnestClaimDuration)
            .plus(1);
          earnestAmount = new BigNumber(claimProofEarn.data.amount).times(
            ratio
          );
        }
      } else {
        earnestAmount = new BigNumber(claimProofEarn.data.amount);
      }
    } else if (earnestClaimEnd.isLessThan(Date.now())) {
      earnestAmount = new BigNumber(claimProofEarn.data.amount).times(2);
    } else {
      const ratio = new BigNumber(Date.now())
        .minus(claimStart)
        .dividedBy(earnestClaimDuration)
        .plus(1);
      earnestAmount = new BigNumber(claimProofEarn.data.amount).times(ratio);
    }
    items.push({
      amount: earnestAmount.div(10 ** cloudDecimals).toNumber(),
      isClaimed: earnClaimStatusAccount !== null,
      label: 'CLOUD',
      address: cloudMint,
      claims:
        earnestClaimTime && earnestClaimTx
          ? [
              {
                date: earnestClaimTime,
                amount: earnestAmount.div(10 ** cloudDecimals).toNumber(),
                txId: earnestClaimTx.signature,
              },
            ]
          : undefined,
      ref: earnClaimStatusAccount
        ? earnClaimStatusAddress.toString()
        : undefined,
    });
  }

  return getAirdropRaw({
    statics: s1AirdropStatics,
    items,
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: s1AirdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  `${platformId}-airdrop`,
  s1AirdropStatics.claimEnd
);
