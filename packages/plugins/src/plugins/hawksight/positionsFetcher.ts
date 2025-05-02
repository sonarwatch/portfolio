import {
  NetworkId,
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getHawksightUserPdas } from './helper';
import obligationsFetcher from '../save/obligationsFetcher';
import dlmmPositionFetcher from '../meteora/dlmm/dlmmPositionsFetcher';
import tokenFetcher from '../tokens/fetchers/solana';
import { getWhirlpoolPositions } from '../orca/getWhirlpoolPositions';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { getAssetsByOwnerDas } from '../../utils/solana/das/getAssetsByOwnerDas';
import { DisplayOptions } from '../../utils/solana/das/types';
import { heliusAssetToAssetCollectible } from '../../utils/solana/das/heliusAssetToAssetCollectible';
import { mSOLMint } from '../marinade/constants';
import { hasTransactions } from '../../utils/hasTransactions';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const derivedAddresses = getHawksightUserPdas(new PublicKey(owner));

  if (
    !(await hasTransactions(derivedAddresses[0].toString(), NetworkId.solana))
  )
    return [];

  if (
    !(await hasTransactions(derivedAddresses[1].toString(), NetworkId.solana))
  )
    return [];

  const dasUrl = getSolanaDasEndpoint();

  const displayOptions: DisplayOptions = {
    showCollectionMetadata: true,
    showUnverifiedCollections: true,
    showInscription: false,
    showNativeBalance: false,
    showGrandTotal: false,
    showFungible: true,
  };

  const heliusAssets = (
    await Promise.all([
      getAssetsByOwnerDas(
        dasUrl,
        derivedAddresses[0].toString(),
        displayOptions
      ),
      getAssetsByOwnerDas(
        dasUrl,
        derivedAddresses[1].toString(),
        displayOptions
      ),
    ])
  ).flat();

  const collectibles: PortfolioAssetCollectible[] = [];
  for (const asset of heliusAssets) {
    const collectible = await heliusAssetToAssetCollectible(asset, cache);

    if (collectible) collectibles.push(collectible);
  }

  const portfolioElements = (
    await Promise.all([
      // This handles Kamino, Saber, Marinade
      tokenFetcher.executor(derivedAddresses[0].toString(), cache),
      tokenFetcher.executor(derivedAddresses[1].toString(), cache),
      // This handles Orca
      getWhirlpoolPositions(cache, collectibles),
      // This handles Save
      obligationsFetcher.executor(derivedAddresses[0].toString(), cache),
      obligationsFetcher.executor(derivedAddresses[1].toString(), cache),
      // This handles Meteora
      dlmmPositionFetcher.executor(derivedAddresses[0].toString(), cache),
      dlmmPositionFetcher.executor(derivedAddresses[1].toString(), cache),
    ])
  ).flat();

  if (portfolioElements.length === 0) return [];

  const elements: PortfolioElement[] = [];
  const tokens: PortfolioAsset[] = [];
  for (const element of portfolioElements) {
    if (
      element.platformId === walletTokensPlatformId &&
      element.type === PortfolioElementType.multiple
    ) {
      element.data.assets.forEach((token) => {
        if (token.type === 'token' && token.data.address === mSOLMint) {
          tokens.push(token);
          return;
        }
        tokens.push({ ...token, attributes: { isClaimable: true } });
      });
    }
    element.name =
      element.platformId.slice(0, 1).toUpperCase() +
      element.platformId.slice(1);

    if (
      (element.name && element.name === 'Wallet-nfts') ||
      element.platformId === walletTokensPlatformId
    )
      continue;

    element.platformId = platformId;
    elements.push({
      ...element,
    });
  }
  const value = getUsdValueSum(tokens.map((t) => t.value));
  if (value !== 0)
    elements.push({
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      platformId,
      label: 'Rewards',
      value,
      data: { assets: tokens },
    });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
