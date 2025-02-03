import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';

import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../constants';
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
import { DisplayOptions, HeliusAsset } from '../../../utils/solana/das/types';
import { heliusAssetToAssetCollectible } from '../../../utils/solana/das/heliusAssetToAssetCollectible';
import { HeliusAssetFetcher, NftFetcher } from '../types';
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
import { getWalletTokensSolana } from './solana';

type NftChecker = (nft: PortfolioAssetCollectible) => boolean;
type HeliusAssetChecker = (asset: HeliusAsset) => boolean;

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

const heliusAssetsUnderlyingsMap: Map<
  string,
  { checker: HeliusAssetChecker; fetcher: HeliusAssetFetcher }
> = new Map([
  [
    'wallet-tokens',
    {
      checker: () => true,
      fetcher: getWalletTokensSolana,
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

  const assetsByIdentifier: Map<string, HeliusAsset[]> = new Map();
  for (let n = 0; n < assets.length; n += 1) {
    const asset = assets[n];
    for (const [key, { checker }] of heliusAssetsUnderlyingsMap.entries()) {
      if (!checker(asset)) continue;
      if (!assetsByIdentifier.get(key)) {
        assetsByIdentifier.set(key, []);
      }
      assetsByIdentifier.get(key)?.push(asset);
    }
  }

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
      break; // 1 NFT can only be used by 1 fetcher with this break (we'll might need to remove it)
    }
  }

  const results: Promise<PortfolioElement[]>[] = [];
  for (const [key, { fetcher }] of nftsUnderlyingsMap) {
    const nfts = nftsByIndentifier.get(key);
    if (nfts) results.push(fetcher(cache, nfts));
  }
  for (const [key, { fetcher }] of heliusAssetsUnderlyingsMap) {
    const cAssets = assetsByIdentifier.get(key);
    if (cAssets) results.push(fetcher(cache, cAssets));
  }
  const result = await Promise.allSettled(results);

  return result
    .map((res) => (res.status === 'rejected' ? [] : res.value))
    .flat();
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-solana-nfts-underlyings`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
