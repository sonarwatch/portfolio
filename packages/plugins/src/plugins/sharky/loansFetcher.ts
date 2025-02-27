import {
  collectibleFreezedTag,
  NetworkId,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  cachePrefix,
  collectionsCacheKey,
  platformId,
  sharkyIdlItem,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getAutoParsedProgramAccounts,
  ParsedAccount,
} from '../../utils/solana';
import { Collection, Loan } from './types';
import { getLoanFilters } from './filters';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { PortfolioAssetCollectibleParams } from '../../utils/elementbuilder/Params';

const collectionsMemo = new MemoizedCache<
  ParsedAccount<Collection>[],
  Map<string, Collection>
>(
  collectionsCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'orderBook')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [filterA, filterB, filterC] = getLoanFilters(owner);
  const accounts = (
    await Promise.all([
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, filterA),
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, filterB),
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, filterC),
    ])
  ).flat();
  if (accounts.length === 0) return [];

  const [solTokenPrice, collections] = await Promise.all([
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
    collectionsMemo.getItem(cache),
  ]);

  if (!collections) throw new Error('Collections not cached');
  if (!solTokenPrice) throw new Error('Sol price not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  accounts.forEach((acc) => {
    const collection = collections.get(acc.orderBook);
    if (!collection) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
    });

    let mintAsset: PortfolioAssetCollectibleParams | null = null;
    if (acc.loanState.taken?.taken.nftCollateralMint) {
      mintAsset = {
        address: acc.loanState.taken.taken.nftCollateralMint,
        collection: {
          name: collection.name,
          floorPrice: new BigNumber(collection.floor).multipliedBy(
            solTokenPrice.price
          ),
        },
        attributes: { tags: [collectibleFreezedTag] },
      };
    }

    const solAsset = {
      address: solanaNativeAddress,
      amount: acc.principalLamports,
    };

    let name;

    if (acc.loanState.offer) {
      // LENDER
      element.addSuppliedAsset(solAsset);
      name = `Lend Offer on ${collection.name}`;
    } else if (acc.loanState.taken) {
      if (acc.loanState.taken.taken.lenderNoteMint === owner.toString()) {
        // LENDER
        element.addSuppliedAsset(solAsset);
        if (mintAsset) element.addBorrowedCollectibleAsset(mintAsset);
        name = `Active Loan`;
      } else {
        // BORROWER
        if (mintAsset) {
          element.addSuppliedCollectibleAsset(mintAsset);
        }
        element.addBorrowedAsset(solAsset);
        name = `Active Loan`;
      }
    }

    if (name) element.setName(name);

    element.setFixedTerms(
      acc.loanState.offer !== undefined ||
        (acc.loanState.taken
          ? acc.loanState.taken.taken.lenderNoteMint === owner.toString()
          : false),
      acc.loanState.taken
        ? (Number(acc.loanState.taken.taken.terms.time.start) +
            Number(acc.loanState.taken.taken.terms.time.duration)) *
            1000
        : undefined
    );
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
