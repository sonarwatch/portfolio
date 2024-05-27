import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';

import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../constants';
import { Cache } from '../../../Cache';
import { getRaydiumCLMMPositions } from '../../raydium/getRaydiumCLMMPositions';
import { getOrcaAppraiser } from '../../orca/getWhirlpoolPositions';
import { isARaydiumPosition } from '../../raydium/helpers';
import { isAnOrcaPosition } from '../../orca/helpers';
import { isClmmPosition as isCropperPosition } from '../../cropper/helpers';

import {
  getHeliumElementsFromNFTs,
  isAnHeliumNFTVote,
} from '../../daos/helpers';
import getSolanaDasEndpoint from '../../../utils/clients/getSolanaDasEndpoint';
import { getAssetsByOwnerDas } from '../../../utils/solana/das/getAssetsByOwnerDas';
import { DisplayOptions } from '../../../utils/solana/das/types';
import { heliusAssetToAssetCollectible } from '../../../utils/solana/das/heliusAssetToAssetCollectible';
import { Appraiser as NftFetcher } from '../types';
import {
  whirlpoolProgram,
  platformId as orcaPlatformId,
} from '../../orca/constants';
import {
  clmmPid,
  platformId as cropperPlatformId,
} from '../../cropper/constants';

type NftChecker = (nft: PortfolioAssetCollectible) => boolean;

// Add here any pair of [Identifier,Appraiser] =
// Identifier : a string to filter the asset concerned
// Appraiser : the function to apply to those asset to get their underlying value
//
// Don't add anything else.

const nftsUnderlyingsMap: Map<
  string,
  { checker: NftChecker; fetcher: NftFetcher }
> = new Map([
  [
    'raydium',
    { checker: isARaydiumPosition, fetcher: getRaydiumCLMMPositions },
  ],
  [
    'orca',
    {
      checker: isAnOrcaPosition,
      fetcher: getOrcaAppraiser(orcaPlatformId, whirlpoolProgram),
    },
  ],
  [
    'cropper',
    {
      checker: isCropperPosition,
      fetcher: getOrcaAppraiser(cropperPlatformId, clmmPid),
    },
  ],
  [
    'helium',
    {
      checker: isAnHeliumNFTVote,
      fetcher: getHeliumElementsFromNFTs,
    },
  ],
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

  const nftsByIndentifier: Map<string, PortfolioAssetCollectible[]> = new Map();
  for (let n = 0; n < assets.length; n += 1) {
    const nft = heliusAssetToAssetCollectible(assets[n]);
    if (!nft) continue;
    if (nft.attributes.tags?.includes('compressed')) continue;

    for (const [key, { checker }] of nftsUnderlyingsMap.entries()) {
      if (!checker(nft)) continue;
      if (!nftsByIndentifier.get(key)) {
        nftsByIndentifier.set(key, []);
      }
      nftsByIndentifier.get(key)?.push(nft);
      break;
    }
  }

  const appraisersResults: Promise<PortfolioElement[]>[] = [];
  for (const [key, { fetcher }] of nftsUnderlyingsMap) {
    const nfts = nftsByIndentifier.get(key);
    if (nfts) appraisersResults.push(fetcher(cache, nfts));
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
