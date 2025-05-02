import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';

import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { Cache } from '../../../Cache';
import { getRaydiumCLMMPositions } from '../../raydium/getRaydiumCLMMPositions';
import { getOrcaNftFetcher } from '../../orca/getWhirlpoolPositions';
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
import { NftFetcher } from '../types';
import {
  platformId as orcaPlatformId,
  whirlpoolProgram,
} from '../../orca/constants';
import {
  clmmPid,
  platformId as cropperPlatformId,
} from '../../cropper/constants';
import {
  getPicassoElementsFromNFTs,
  isPicassoPosition,
} from '../../picasso/helpers';

type NftChecker = (nft: PortfolioAssetCollectible) => boolean;

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
      fetcher: getOrcaNftFetcher(orcaPlatformId, whirlpoolProgram),
    },
  ],
  [
    'cropper',
    {
      checker: isCropperPosition,
      fetcher: getOrcaNftFetcher(cropperPlatformId, clmmPid),
    },
  ],
  [
    'helium',
    {
      checker: isAnHeliumNFTVote,
      fetcher: getHeliumElementsFromNFTs,
    },
  ],
  [
    'picasso',
    {
      checker: isPicassoPosition,
      fetcher: getPicassoElementsFromNFTs,
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
    const nft = await heliusAssetToAssetCollectible(assets[n], cache);
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

  const results: Promise<PortfolioElement[]>[] = [];
  for (const [key, { fetcher }] of nftsUnderlyingsMap) {
    const nfts = nftsByIndentifier.get(key);
    if (nfts) results.push(fetcher(cache, nfts));
  }
  const result = await Promise.allSettled(results);

  return result
    .map((res) => (res.status === 'rejected' ? [] : res.value))
    .flat();
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatformId}-solana-nfts-underlyings`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
