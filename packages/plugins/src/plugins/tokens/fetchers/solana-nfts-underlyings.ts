import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';

import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../constants';
import { Cache } from '../../../Cache';
import { getRaydiumCLMMPositions } from '../../raydium/getRaydiumCLMMPositions';
import { getWhirlpoolPositions } from '../../orca/getWhirlpoolPositions';
import { isARaydiumPosition } from '../../raydium/helpers';
import { isAnOrcaPosition } from '../../orca/helpers';
import {
  getPositionFromVotingEscrowNFT,
  isAVotingEscrowPosition,
} from '../../realms/helpers';
import getSolanaDasEndpoint from '../../../utils/clients/getSolanaDasEndpoint';
import { getAssetsByOwnerDas } from '../../../utils/solana/das/getAssetsByOwnerDas';
import { HeliusAsset } from '../../../utils/solana/das/types';

type Appraiser = (
  cache: Cache,
  nfts: HeliusAsset[]
) => Promise<PortfolioElement[]>;

type Identifier = (nft: HeliusAsset) => boolean;

// Add here any pair of [Identifier,Appraiser] =
// Identifier : a string to filter the asset concerned
// Appraiser : the function to apply to those asset to get their underlying value
//
// Don't add anything else.

const appraiserByIdentifier: Map<Identifier, Appraiser> = new Map([
  [isARaydiumPosition, getRaydiumCLMMPositions],
  [isAnOrcaPosition, getWhirlpoolPositions],
  [isAVotingEscrowPosition, getPositionFromVotingEscrowNFT],
]);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const dasEndpoint = getSolanaDasEndpoint();
  const items = await getAssetsByOwnerDas(dasEndpoint, owner);

  const nftsByIndentifier: Map<Identifier, HeliusAsset[]> = new Map();
  for (let n = 0; n < items.length; n++) {
    const nft = items[n];
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
