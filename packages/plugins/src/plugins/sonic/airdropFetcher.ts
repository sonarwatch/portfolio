import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import {
  AirdropFetcher,
  AirdropFetcherExecutor,
  airdropFetcherToFetcher,
  getAirdropRaw,
} from '../../AirdropFetcher';
import { airdropStatics, platformId, sonicMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { airdropProofStruct } from './structs';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';

const executor: AirdropFetcherExecutor = async (owner: string) => {
  const client = getClientSolana();

  const account = await ParsedGpa.build(
    client,
    airdropProofStruct,
    new PublicKey('magnaSHyv8zzKJJmr8NSz5JXmtdGDTTFPEADmvNAwbj')
  )
    .addDataSizeFilter(127)
    .addFilter('discriminator', [7, 25, 94, 15, 208, 170, 4, 103])
    .addFilter('user', new PublicKey(owner))
    .run();

  if (!account.length)
    return getAirdropRaw({
      statics: airdropStatics,
      items: [
        {
          amount: 0,
          isClaimed: false,
          label: 'SONIC',
          address: sonicMint,
        },
      ],
    });

  const claims = (
    await Promise.all(
      account.map((acc) =>
        getClaimTransactions(owner, acc.pubkey.toString(), sonicMint)
      )
    )
  ).flat();

  return getAirdropRaw({
    statics: airdropStatics,
    items: [
      {
        amount: claims.reduce((acc, claim) => acc + claim.amount, 0),
        isClaimed: true,
        label: 'SONIC',
        address: sonicMint,
        claims,
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
  'sonic-airdrop',
  airdropStatics.claimEnd
);
