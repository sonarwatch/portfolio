import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  getAirdropRaw,
  airdropFetcherToFetcher,
} from '../../AirdropFetcher';

import { airdropStatics, meMint, platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { distributionClaimStruct } from './structs';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSolana();
  // const input = JSON.stringify({
  //   json: {
  //     claimWallet: owner,
  //     token: meMint,
  //     allocationEvent: 'tge-airdrop-final',
  //   },
  // });
  const claimStatus = await ParsedGpa.build(
    client,
    distributionClaimStruct,
    stakingPid
  )
    .addFilter('claimant', new PublicKey(owner))
    .addFilter('discriminator', [239, 137, 48, 156, 94, 143, 205, 29])
    .run();

  if (claimStatus.length === 0) {
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'ME',
          address: meMint,
        },
      ],
    });
  }

  // const encodedInput = encodeURIComponent(input);
  // const res: AxiosResponse<AirdropResponse> = await axios.get(
  //   airdropApi + encodedInput
  // );

  // if (!res.data)
  //   return getAirdropRaw({
  //     statics: airdropStatics,
  //     items: [
  //       {
  //         amount: 0,
  //         isClaimed: false,
  //         label: 'ME',
  //         address: meMint,
  //       },
  //     ],
  //   });

  const claims = await Promise.all([
    ...claimStatus.map((cS) => getClaimTransactions(owner, cS.pubkey, meMint)),
  ]);

  const claimedAmount = claims.reduce(
    (acc, claim) =>
      acc.plus(
        claim.reduce((sum, tx) => sum.plus(tx.amount), new BigNumber(0))
      ),
    new BigNumber(0)
  );

  // const isClaimed = res.data.result.data.json.claimStatus === 'claimed';
  // const amount = new BigNumber(res.data.result.data.json.availableTokenAmount)
  //   .dividedBy(10 ** 6)
  //   .toNumber();

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: claimedAmount.toNumber(),
        isClaimed: true,
        label: 'ME',
        address: meMint,
        claims: claims.flat(),
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
  'magiceden-airdrop',
  airdropStatics.claimEnd
);
