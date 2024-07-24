import BigNumber from 'bignumber.js';
import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';
import { getClientSolana } from '../../utils/clients';
import { ClaimProofResponse } from '../jupiter/types';
import { lfgApiBaseUrl, lfgDisProgram } from '../jupiter/launchpad/constants';
import { airdropStatics, cloudMint, cloudDecimals } from './constants';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const claimProofBase: AxiosResponse<ClaimProofResponse> | null = await axios
    .get(
      `${lfgApiBaseUrl}/CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu/${owner}`,
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
      statics: airdropStatics,
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
  const claimStatusAaccount = await client.getAccountInfo(claimStatusAddress);
  const items = [
    {
      amount: new BigNumber(claimProofBase.data.amount)
        .div(10 ** cloudDecimals)
        .toNumber(),
      isClaimed: claimStatusAaccount !== null,
      label: 'CLOUD',
      address: cloudMint,
    },
  ];

  // Check Earnestness
  const claimProofEarn: AxiosResponse<ClaimProofResponse> | null = await axios
    .get(
      `${lfgApiBaseUrl}/earnestness-CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu/${owner}`,
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
    const earnClaimStatusAaccount = await client.getAccountInfo(
      earnClaimStatusAddress
    );
    items.push({
      amount: new BigNumber(claimProofEarn.data.amount)
        .div(10 ** cloudDecimals)
        .toNumber(),
      isClaimed: earnClaimStatusAaccount !== null,
      label: 'CLOUD',
      address: cloudMint,
    });
  }

  return getAirdropRaw({
    statics: airdropStatics,
    items,
  });
};

const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export default airdropFetcher;
