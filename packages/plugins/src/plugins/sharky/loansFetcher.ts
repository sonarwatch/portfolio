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
  loanDataSize,
  platformId,
  sharkyProgram,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ParsedAccount } from '../../utils/solana';
import { Collection } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { PortfolioAssetCollectibleParams } from '../../utils/elementbuilder/Params';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { loanStruct } from './structs';

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

  const accounts = (
    await Promise.all([
      ParsedGpa.build(connection, loanStruct, sharkyProgram)
        .addRawFilter(115, owner)
        .addDataSizeFilter(loanDataSize)
        .run(),
      ParsedGpa.build(connection, loanStruct, sharkyProgram)
        .addRawFilter(147, owner)
        .addDataSizeFilter(loanDataSize)
        .run(),
      ParsedGpa.build(connection, loanStruct, sharkyProgram)
        .addRawFilter(83, owner)
        .addDataSizeFilter(loanDataSize)
        .run(),
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
    const collection = collections.get(acc.orderBook.toString());
    if (!collection) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
    });

    let mintAsset: PortfolioAssetCollectibleParams | null = null;
    if (acc.loanState.__kind === 'Taken') {
      mintAsset = {
        address: acc.loanState.nftCollateralMint,
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

    if (acc.loanState.__kind === 'Offer') {
      // LENDER
      element.addSuppliedAsset(solAsset);
      name = `Lend Offer on ${collection.name}`;
    } else if (acc.loanState.__kind === 'Taken') {
      if (acc.loanState.lenderNoteMint.toString() === owner.toString()) {
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
      (acc.loanState.__kind === 'Taken'
        ? acc.loanState.lenderNoteMint.toString() === owner.toString()
        : false) || acc.loanState.__kind !== 'Offer',
      acc.loanState.__kind === 'Taken'
        ? (Number(acc.loanState.terms.start) +
            Number(acc.loanState.terms.duration)) *
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
