import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

import {
  FindNftsByOwnerOutput,
  Metadata,
  Metaplex,
  Nft,
  Sft,
} from '@metaplex-foundation/js';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { Cache } from '../../../Cache';
import { getRaydiumCLMMPositions } from '../../raydium/getRaydiumCLMMPositions';
import { getWhirlpoolPositions } from '../../orca/getWhirlpoolPositions';
import { isARaydiumPosition } from '../../raydium/helpers';
import { isAnOrcaPosition } from '../../orca/helpers';

type Appraiser = (
  cache: Cache,
  nfts: FindNftsByOwnerOutput
) => Promise<PortfolioElement[]>;

type Identifier = (nft: Metadata | Nft | Sft) => boolean;

// Add here any pair of [Identifier,Appraiser] =
// Identifier : a string to filter the asset concerned
// Appraiser : the function to apply to those asset to get their underlying value
//
// Don't add anything else.

const appraiserByIdentifier: Map<Identifier, Appraiser> = new Map([
  [isARaydiumPosition, getRaydiumCLMMPositions],
  [isAnOrcaPosition, getWhirlpoolPositions],
]);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ownerPubKey = new PublicKey(owner);
  const metaplex = new Metaplex(client);

  const outputs = await metaplex.nfts().findAllByOwner({
    owner: ownerPubKey,
  });

  const nftsByIndentifier: Map<Identifier, FindNftsByOwnerOutput> = new Map();
  for (let n = 0; n < outputs.length; n++) {
    const nft = outputs[n];
    for (const identifier of appraiserByIdentifier.keys()) {
      if (identifier(nft)) {
        if (!nftsByIndentifier.get(identifier)) {
          nftsByIndentifier.set(identifier, [nft]);
        } else {
          nftsByIndentifier.get(identifier)?.push(nft);
        }
      }
    }
  }

  const appraisersResults: Promise<PortfolioElement[]>[] = [];
  for (const [identifier, appraiser] of appraiserByIdentifier) {
    const nfts = nftsByIndentifier.get(identifier);
    if (nfts) appraisersResults.push(appraiser(cache, nfts));
  }

  const result = await Promise.allSettled(appraisersResults);

  const elements = result
    .map((res) => (res.status === 'rejected' ? [] : res.value))
    .flat();

  return elements;
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-solana-nfts-underlyings`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
