import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import {
  airdropApi,
  airdropPid,
  fidaAirdropStatics,
  fidaDecimals,
  fidaMint,
  platformId,
} from './constants';
import { AirdropResponse } from './types';
import { claimStatusStruct } from '../jito/structs';
import { getClientSolana } from '../../utils/clients';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const apiRes: AxiosResponse<AirdropResponse> | null = await axios
    .get(airdropApi + owner, { timeout: 5000 })
    .catch(() => null);
  const client = getClientSolana();
  const claimStatus = await ParsedGpa.build(
    client,
    claimStatusStruct,
    airdropPid
  )
    .addFilter('discriminator', [22, 183, 249, 157, 247, 95, 150, 96])
    .addFilter('claimant', new PublicKey(owner))
    .run();

  // neither an API response nor claims accounts
  if ((!apiRes || apiRes.data.error) && !claimStatus.length) {
    return getAirdropRaw({
      statics: fidaAirdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'FIDA',
          address: fidaMint,
        },
      ],
    });
  }

  // if there is no claim status, it means the user is eligible but has not claimed yet
  if (!claimStatus.length && apiRes) {
    return getAirdropRaw({
      statics: fidaAirdropStatics,
      items: [
        {
          amount: new BigNumber(apiRes.data.amount_unlocked)
            .dividedBy(10 ** fidaDecimals)
            .toNumber(),
          isClaimed: false,
          label: 'FIDA',
          address: fidaMint,
        },
      ],
    });
  }

  const claims = await Promise.all([
    ...claimStatus.map((cs) =>
      getClaimTransactions(owner, cs.pubkey, fidaMint)
    ),
  ]);

  const claimedAmount = claims.reduce(
    (acc, claim) =>
      acc.plus(
        claim.reduce((sum, tx) => sum.plus(tx.amount), new BigNumber(0))
      ),
    new BigNumber(0)
  );

  return getAirdropRaw({
    statics: fidaAirdropStatics,
    items: [
      {
        amount: apiRes
          ? new BigNumber(apiRes.data.amount_unlocked)
              .dividedBy(10 ** fidaDecimals)
              .toNumber()
          : claimedAmount.toNumber(),
        isClaimed: true,
        label: 'FIDA',
        address: fidaMint,
        claims: claims.flat(),
        ref: claimStatus ? claimStatus[0].pubkey.toString() : undefined,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: fidaAirdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  fidaAirdropStatics.id,
  fidaAirdropStatics.claimEnd
);
