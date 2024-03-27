import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';

import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../constants';
import { Cache } from '../../../Cache';
import { getRaydiumCLMMPositions } from '../../raydium/getRaydiumCLMMPositions';
import { getWhirlpoolPositions } from '../../orca/getWhirlpoolPositions';
import { isARaydiumPosition } from '../../raydium/helpers';
import { isAnOrcaPosition } from '../../orca/helpers';
import {
  getHeliumElementsFromNFTs,
  isAnHeliumNFTVote,
} from '../../realms/helpers';
import getSolanaDasEndpoint from '../../../utils/clients/getSolanaDasEndpoint';
import { getAssetsByOwnerDas } from '../../../utils/solana/das/getAssetsByOwnerDas';
import { DisplayOptions } from '../../../utils/solana/das/types';
import { heliusAssetToAssetCollectible } from '../../../utils/solana/das/heliusAssetToAssetCollectible';

type Appraiser = (
  cache: Cache,
  nfts: PortfolioAssetCollectible[]
) => Promise<PortfolioElement[]>;

type Identifier = (nft: PortfolioAssetCollectible) => boolean;

// Add here any pair of [Identifier,Appraiser] =
// Identifier : a string to filter the asset concerned
// Appraiser : the function to apply to those asset to get their underlying value
//
// Don't add anything else.

const appraiserByIdentifier: Map<Identifier, Appraiser> = new Map([
  [isARaydiumPosition, getRaydiumCLMMPositions],
  [isAnOrcaPosition, getWhirlpoolPositions],
  [isAnHeliumNFTVote, getHeliumElementsFromNFTs],
]);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const dasEndpoint = getSolanaDasEndpoint();
  const displayOptions: DisplayOptions = {
    showCollectionMetadata: true,
    showUnverifiedCollections: true,
    showInscription: false,
    showNativeBalance: false,
    showGrandTotal: false,
    showFungible: true,
  };
  const assets = await getAssetsByOwnerDas(dasEndpoint, owner, displayOptions);

  const nftsByIndentifier: Map<Identifier, PortfolioAssetCollectible[]> =
    new Map();
  for (let n = 0; n < assets.length; n++) {
    const nft = heliusAssetToAssetCollectible(assets[n]);
    if (!nft) continue;
    if (nft.attributes.tags?.includes('compressed')) continue;

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
