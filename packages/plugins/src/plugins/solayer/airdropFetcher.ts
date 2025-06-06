import { Claim, NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  airdropApi,
  airdropStatics,
  layerDecimals,
  layerMint,
  platformId,
} from './constants';
import { AirdropResponse } from './types';
import { getClientSolana } from '../../utils/clients';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';
import { getProgramAccounts } from '../../utils/solana';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSolana();

  let res: AxiosResponse<AirdropResponse>;
  try {
    res = await axios.get(airdropApi + owner);
  } catch (err) {
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'LAYER',
          address: layerMint,
        },
      ],
    });
  }

  if (!res.data || res.data.totalAmount === '0')
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'LAYER',
          address: layerMint,
        },
      ],
    });

  const totalAmount = new BigNumber(res.data.totalAmount);

  const claimAccounts = await getProgramAccounts(
    client,
    new PublicKey('ARDPkhymCbfdan375FCgPnBJQvUfHeb7nHVdBfwWSxrp'),
    [
      {
        memcmp: {
          offset: 0,
          bytes: 'NiUarf1ngHA',
        },
      },
      {
        memcmp: {
          offset: 9,
          bytes: owner,
        },
      },
    ]
  );
  const claimAccount = claimAccounts[0];

  let claims: Claim[] = [];
  if (claimAccount) {
    claims = await getClaimTransactions(owner, claimAccount.pubkey, layerMint);
  }

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: totalAmount.dividedBy(10 ** layerDecimals).toNumber(),
        isClaimed: false,
        label: 'LAYER',
        address: layerMint,
        claims,
        ref: claimAccount ? claimAccount.pubkey.toString() : undefined,
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
  'solayer-airdrop',
  airdropStatics.claimEnd
);
