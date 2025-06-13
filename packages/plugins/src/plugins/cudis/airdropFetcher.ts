import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { PublicKey } from '@solana/web3.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
  airdropFetcherToFetcher,
} from '../../AirdropFetcher';

import { airdropApi, airdropStatics, platformId, cudisMint } from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getClientSolana } from '../../utils/clients';
import { AirdropProof, airdropProofStruct } from '../magna/structs';
import { airdropPid } from '../magna/constant';
import { ParsedAccount } from '../../utils/solana';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const [
    // res,
    airdropProofs,
  ]: [
    // AxiosResponse<AirdropResponse>,
    ParsedAccount<AirdropProof>[]
  ] = await Promise.all([
    ParsedGpa.build(getClientSolana(), airdropProofStruct, airdropPid)
      .addFilter('discriminator', [7, 25, 94, 15, 208, 170, 4, 103])
      .addFilter('user', new PublicKey(owner))
      .debug()
      .run(),
  ]);

  const res = await axios.post(
    airdropApi,
    {
      pubkey: owner,
    },
    { timeout: 4000 }
  );

  const claims = await Promise.all([
    ...airdropProofs.map((proof) =>
      getClaimTransactions(owner, proof.pubkey, cudisMint)
    ),
  ]);

  const amountClaimed = claims.reduce(
    (acc, claim) => acc + claim.reduce((sum, c) => sum + c.amount, 0),
    0
  );

  if (res)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: Number(res.data.data.token),
          isClaimed: amountClaimed === Number(res.data.data.token),
          label: 'CUDIS',
          address: cudisMint,
          claims: claims.flat(),
        },
      ],
    });

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: 0,
        isClaimed: false,
        label: 'CUDIS',
        address: cudisMint,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};

export const fetcher = airdropFetcherToFetcher(
  airdropFetcher,
  platformId,
  airdropStatics.id,
  airdropStatics.claimEnd
);
