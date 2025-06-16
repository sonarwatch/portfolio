import {
  NetworkId,
  PortfolioAsset,
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
import { mSOLMint } from '../marinade/constants';
import { hasTransactions } from '../../utils/hasTransactions';
import whirlpoolFetcher from '../orca/whirlpoolFetcher';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const derivedAddresses = getHawksightUserPdas(new PublicKey(owner));

  const hasAnyTransactions = await Promise.all([
    hasTransactions(derivedAddresses[0].toString(), NetworkId.solana),
    hasTransactions(derivedAddresses[1].toString(), NetworkId.solana),
  ]).then((results) => results[0] || results[1]);

  if (!hasAnyTransactions) return [];

  const portfolioElements = (
    await Promise.all([
      // This handles Kamino, Saber, Marinade
      tokenFetcher.executor(derivedAddresses[0].toString(), cache),
      tokenFetcher.executor(derivedAddresses[1].toString(), cache),
      // This handles Orca
      whirlpoolFetcher.executor(derivedAddresses[0].toString(), cache),
      whirlpoolFetcher.executor(derivedAddresses[1].toString(), cache),
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
