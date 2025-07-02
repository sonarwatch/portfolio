import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { getClientSolana } from '../../utils/clients';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';
import { deriveClaimStatus } from '../../utils/solana/jupiter/deriveClaimStatus';
import { airdropStatics, distributorPid, fragMint } from './constants';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSolana();
  const claimStatus = deriveClaimStatus(
    owner,
    'BDWeWshtozDsYrfL1UpHbRG7zeWKZ8fAV7cUCBuum61a',
    distributorPid
  );
  const claimAccount = await client.getAccountInfo(claimStatus);

  const claims = await getClaimTransactions(owner, claimStatus, fragMint);
  const totalAmount = claims.reduce(
    (acc, claim) => acc.plus(claim.amount),
    new BigNumber(0)
  );
  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: totalAmount.toNumber(),
        isClaimed: !!claimAccount,
        label: 'FRAG',
        address: fragMint,
        claims,
        ref: claimAccount ? claimStatus.toString() : undefined,
      },
    ],
  });
};

export const airdropFetcher: AirdropFetcher = {
  id: airdropStatics.id,
  networkId: NetworkId.solana,
  executor,
};
