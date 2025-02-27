import {
  NetworkId,
  solanaNativeAddress,
  collectibleFreezedTag,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  cachePrefix,
  citrusIdlItem,
  collectionsCacheKey,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { Collection, Loan } from './types';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { getLoanFilters } from './filters';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { PortfolioAssetCollectibleParams } from '../../utils/elementbuilder/Params';

const collectionsMemo = new MemoizedCache<
  Collection[],
  Map<string, Collection>
>(
  collectionsCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'id')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [filterA, filterB] = getLoanFilters(owner);
  const allAccounts = (
    await Promise.all([
      getAutoParsedProgramAccounts<Loan>(connection, citrusIdlItem, filterA),
      getAutoParsedProgramAccounts<Loan>(connection, citrusIdlItem, filterB),
    ])
  ).flat();

  const accounts = allAccounts.filter(
    (acc) => !acc.status.repaid // hide past loans
  );

  if (accounts.length === 0) return [];

  const [solTokenPrice, collections] = await Promise.all([
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
    collectionsMemo.getItem(cache),
  ]);

  if (!collections) throw new Error('Collections not cached');
  if (!solTokenPrice) throw new Error('Sol price not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((acc) => {
    const collection = collections.get(acc.collectionConfig);
    if (!collection) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: acc.pubkey,
    });

    let mintAsset: PortfolioAssetCollectibleParams | null = null;
    if (acc.mint && acc.mint !== '11111111111111111111111111111111') {
      mintAsset = {
        address: acc.mint,
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
      amount: new BigNumber(
        acc.ltvTerms ? acc.ltvTerms.maxOffer : acc.loanTerms.principal
      ),
    };

    let name;
    if (acc.lender === owner.toString()) {
      // LENDER
      element.addSuppliedAsset(solAsset);
      if (mintAsset) element.addBorrowedCollectibleAsset(mintAsset);

      if (acc.status.waitingForBorrower) {
        name = `Lend Offer on ${collection.name}`;
      } else if (acc.status.active || acc.status.onSale) {
        name = `Active Loan`;
      } else if (acc.status.defaulted) {
        name = `Defaulted Loan`;
      }
    } else {
      // BORROWER
      element.addBorrowedAsset(solAsset);
      if (mintAsset) element.addSuppliedCollectibleAsset(mintAsset);

      if (acc.status.waitingForLender) {
        name = `Borrow Offer`;
      } else if (acc.status.active || acc.status.onSale) {
        name = `Active Loan`;
      } else if (acc.status.defaulted) {
        name = `Expired Loan`;
      }
    }

    if (name) element.setName(name);

    element.setFixedTerms(
      acc.lender === owner.toString(),
      acc.status.active || acc.status.onSale
        ? (Number(acc.startTime) + Number(acc.loanTerms.duration)) * 1000
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
