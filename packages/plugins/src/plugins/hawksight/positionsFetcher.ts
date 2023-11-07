import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { FindNftsByOwnerOutput } from '@metaplex-foundation/js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getHawksightUserPda } from './helper';
import obligationsFetcher from '../solend/obligationsFetcher';
import tokenFetcher from '../tokens/fetchers/solana';
import { getClientSolana } from '../../utils/clients';
import { getWhirlpoolPositions } from '../orca/getWhirlpoolPositions';
import { getTokenAccountsByOwner } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const derivedAddress = getHawksightUserPda(new PublicKey(owner));
  const tokenAccounts = await getTokenAccountsByOwner(client, derivedAddress);
  const accounts = [];
  for (const tokenAccount of tokenAccounts) {
    accounts.push(tokenAccount.mint.toString());
  }
  const nfts: FindNftsByOwnerOutput = [];

  const portfolioElements = await Promise.all([
    // This handles Kamino, Saber, Marinade
    tokenFetcher.executor(derivedAddress.toString(), cache),
    // This handles Orca
    getWhirlpoolPositions(cache, nfts, accounts),
    // This handles Solend
    obligationsFetcher.executor(derivedAddress.toString(), cache),
  ]);

  const elements: PortfolioElement[] = [];
  for (const element of portfolioElements.flat()) {
    const tmpElement = element;
    tmpElement.name = tmpElement.platformId;
    tmpElement.platformId = platformId;
    elements.push({
      ...tmpElement,
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
