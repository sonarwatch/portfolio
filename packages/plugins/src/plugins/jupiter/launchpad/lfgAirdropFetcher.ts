import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../../AirdropFetcher';
import { AirdropConfig } from './types';
import { ClaimProofResponse } from '../types';
import { deriveClaimStatus } from '../../../utils/solana/jupiter/deriveClaimStatus';
import { getClientSolana } from '../../../utils/clients';

export function getLfgAirdropFetcher(aConfig: AirdropConfig): AirdropFetcher {
  const executor: AirdropFetcherExecutor = async (owner: string) => {
    const client = getClientSolana();
    const claimProof: AxiosResponse<ClaimProofResponse> | null = await axios
      .get(aConfig.getApiPath(owner), {
        timeout: 5000,
      })
      .catch((e) => {
        if (
          e.response &&
          (e.response.status === 404 || e.response.status === 200)
        ) {
          return null;
        }
        throw new Error(`Failed to get claim proof: ${aConfig.mint}`);
      });

    if (!claimProof || typeof claimProof.data === 'string')
      return getAirdropRaw({
        statics: aConfig.statics,
        items: [
          {
            amount: 0,
            isClaimed: false,
            label: aConfig.label,
            address: aConfig.mint,
          },
        ],
      });

    const claimStatusAddress = deriveClaimStatus(
      owner,
      claimProof.data.merkle_tree,
      aConfig.distributorProgram
    );
    const claimStatusAaccount = await client.getAccountInfo(claimStatusAddress);

    return getAirdropRaw({
      statics: aConfig.statics,
      items: [
        {
          amount: new BigNumber(claimProof.data.amount)
            .div(10 ** aConfig.decimals)
            .toNumber(),
          isClaimed: claimStatusAaccount !== null,
          label: aConfig.label,
          address: aConfig.mint,
        },
      ],
    });
  };

  return {
    id: aConfig.statics.id,
    networkId: NetworkId.solana,
    executor,
  };
}
