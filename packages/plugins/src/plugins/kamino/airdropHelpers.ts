import { Claim } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { kaminoAirdropProgram, kmnoMint } from './constants';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getClientSolana } from '../../utils/clients';
import { getClaimTransactions } from '../../utils/solana/jupiter/getClaimTransactions';
import { claimStatusStruct } from '../jupiter/launchpad/structs';
import { MemoryCache } from '../../utils/misc/MemoryCache';

const getClaims = async (owner: string) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    claimStatusStruct,
    kaminoAirdropProgram
  )
    .addFilter('accountDiscriminator', [22, 183, 249, 157, 247, 95, 150, 96])
    .addFilter('claimant', new PublicKey(owner))
    .run();

  let claims: Claim[] = [];
  if (accounts) {
    claims = (
      await Promise.all(
        accounts.flatMap((account) => [
          getClaimTransactions(
            'Ec6MuWtpvFcVyMsp7vipKCg1CMkKrWHZpWPdnJF16G57',
            account.pubkey,
            kmnoMint
          ),
          getClaimTransactions(owner, account.pubkey, kmnoMint),
        ])
      )
    ).flat();
  }
  return claims;
};

const memoCollection = new MemoryCache<Claim[]>(getClaims);

export const getCachedClaims = async (owner: string) =>
  memoCollection.getItem(owner);
