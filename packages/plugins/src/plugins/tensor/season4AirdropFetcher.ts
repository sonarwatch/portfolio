import { NetworkId } from '@sonarwatch/portfolio-core';
import { platform, s4Statics, tnsrMint } from './constants';
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

  const claimPda = deriveClaimStatus(
    owner,
    '5qJtp1rTEnW3qUi7SaQpsscqNnvCSo91WFYYbfNJBPDv',
    'Td1ST8yc9Vt7vsBY7rZzrCjkXeGnr4ECMtso9ueLhyQ'
  );

  const client = getClientSolana();
  const claimAccount = await client.getAccountInfo(claimPda);

  const isClaimed = !!claimAccount;

  return getAirdropRaw({
    statics: s4Statics,
    items: [
      {
        amount: baseAlloc ?? 0,
        isClaimed,
        label: 'TNSR',
        address: tnsrMint,
      },
      {
        amount: vectorAlloc ?? 0,
        isClaimed,
        label: 'TNSR',
        address: tnsrMint,
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
  platform.id,
  'tensor-s4',
  s4Statics.claimEnd
);
