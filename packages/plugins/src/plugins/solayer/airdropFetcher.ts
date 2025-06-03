import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import {
  getTransactions,
  parseTransaction,
  getSignatures,
} from '@sonarwatch/tx-parser';
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

  // This is for test purpose
  const claimAccount = new PublicKey(
    '35YYQV8wTUWxKoyMSAzhLSshxYSuiWZmtnsb94asAZfk'
  );
  const claimSignatures = await getSignatures(client, claimAccount.toString());
  const claimTransaction = await getTransactions(
    client,
    claimSignatures.map((s) => s.signature)
  );
  const claimTransactionParsed = claimTransaction.map((t) =>
    parseTransaction(t, owner)
  );

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: totalAmount.dividedBy(10 ** layerDecimals).toNumber(),
        isClaimed: false,
        label: 'LAYER',
        address: layerMint,
        claims: claimTransactionParsed.flatMap((t) => {
          if (t && t.blockTime) {
            const layerChange = t?.balanceChanges.find(
              (b) => b.address === layerMint
            )?.change;
            if (layerChange)
              return {
                amount: layerChange,
                date: t.blockTime * 1000,
                txId: t.signature,
              };
          }
          return [];
        }),
        ref: '35YYQV8wTUWxKoyMSAzhLSshxYSuiWZmtnsb94asAZfk',
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
