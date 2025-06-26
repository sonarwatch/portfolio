import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import {
  airdropStatics,
  jtoDecimals,
  jtoMint,
  merkleDistributor,
  merkleTree,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { claimStatusStruct } from './structs';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSolana();
  const claimStatus = deriveClaimStatus(owner, merkleTree, merkleDistributor);
  const claimAccount = await getParsedAccountInfo(
    client,
    claimStatusStruct,
    claimStatus
  );

  if (!claimAccount) {
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'JTO',
          address: jtoMint,
        },
      ],
    });
  }
  const claims = await getClaimTransactions(owner, claimStatus, jtoMint);

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: claimAccount.unlockedAmount
          .plus(claimAccount.lockedAmount)
          .dividedBy(10 ** jtoDecimals)
          .toNumber(),
        isClaimed: !!claimAccount,
        label: 'JTO',
        address: jtoMint,
        claims,
        ref: claimStatus.toString(),
      },
    ],
  });
};

export const jitoAirdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
