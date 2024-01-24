import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { FindNftsByOwnerOutput } from '@metaplex-foundation/js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getHawksightUserPdas } from './helper';
import obligationsFetcher from '../solend/obligationsFetcher';
import tokenFetcher from '../tokens/fetchers/solana';
import { getClientSolana } from '../../utils/clients';
import { getWhirlpoolPositions } from '../orca/getWhirlpoolPositions';
import { getTokenAccountsByOwner } from '../../utils/solana';
import { walletTokensPlatform } from '../tokens/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const derivedAddresses = getHawksightUserPdas(new PublicKey(owner));

  const tokenAccounts = [
    await getTokenAccountsByOwner(client, derivedAddresses[0]),
    await getTokenAccountsByOwner(client, derivedAddresses[1]),
  ].flat();
  if (tokenAccounts.length === 0) return [];

  const additionalAccounts = tokenAccounts.map((tA) => tA.mint.toString());
  const nfts: FindNftsByOwnerOutput = [];

  const portfolioElements = (
    await Promise.all([
      // This handles Kamino, Saber, Marinade
      tokenFetcher.executor(derivedAddresses[0].toString(), cache),
      tokenFetcher.executor(derivedAddresses[1].toString(), cache),
      // This handles Orca
      getWhirlpoolPositions(cache, nfts, additionalAccounts),
      // This handles Solend
      obligationsFetcher.executor(derivedAddresses[0].toString(), cache),
      obligationsFetcher.executor(derivedAddresses[1].toString(), cache),
    ])
  ).flat();

  if (portfolioElements.length === 0) return [];

  const elements: PortfolioElement[] = [];
  const tokens: PortfolioAsset[] = [];
  for (const element of portfolioElements) {
    if (
      element.platformId === walletTokensPlatform.id &&
      element.type === PortfolioElementType.multiple
    ) {
      tokens.push(...element.data.assets);
    }
    element.name =
      element.platformId.slice(0, 1).toUpperCase() +
      element.platformId.slice(1);

    if (
      (element.name && element.name === 'Wallet-nfts') ||
      element.platformId === 'wallet-tokens'
    )
      continue;

    element.platformId = platformId;
    elements.push({
      ...element,
    });
  }
  elements.push({
    type: PortfolioElementType.multiple,
    networkId: NetworkId.solana,
    platformId,
    label: 'Rewards',
    value: getUsdValueSum(tokens.map((t) => t.value)),
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
