import { NetworkId } from '@sonarwatch/portfolio-core';
import { getSignatures, getTransactions } from '@sonarwatch/tx-parser';
import { platformId, s4Statics, tnsrMint } from './constants';
import { season4Allocations, vectorBonusAllocations } from './season4Alloc';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';
import { getClientSolana } from '../../utils/clients';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const baseAlloc = season4Allocations[owner];
  const vectorAlloc = vectorBonusAllocations[owner];
  const totalAmount = (baseAlloc ?? 0) + (vectorAlloc ?? 0);
  const claimPda = deriveClaimStatus(
    owner,
    '5qJtp1rTEnW3qUi7SaQpsscqNnvCSo91WFYYbfNJBPDv',
    'Td1ST8yc9Vt7vsBY7rZzrCjkXeGnr4ECMtso9ueLhyQ'
  );

  const client = getClientSolana();
  const claimAccount = await client.getAccountInfo(claimPda);
  const signatures = await getSignatures(client, claimPda.toString());
  const transactions = await getTransactions(
    client,
    signatures.map((s) => s.signature)
  );

  const isClaimed = !!claimAccount;

  return getAirdropRaw({
    statics: s4Statics,
    items: [
      {
        amount: totalAmount,
        isClaimed,
        label: 'TNSR',
        address: tnsrMint,
        claims: transactions[0]?.blockTime
          ? [
              {
                amount: totalAmount,
                date: transactions[0].blockTime * 1000,
                txId: transactions[0].transaction.signatures[0],
              },
            ]
          : undefined,
      },
    ],
  });
};

export const airdropS4Fetcher: AirdropFetcher = {
  id: s4Statics.id,
  networkId: NetworkId.solana,
  executor,
};

export const s4Fetcher = airdropFetcherToFetcher(
  airdropS4Fetcher,
  platformId,
  'tensor-s4',
  s4Statics.claimEnd
);
