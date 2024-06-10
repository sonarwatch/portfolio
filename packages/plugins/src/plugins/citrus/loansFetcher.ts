import {
  NetworkId,
  PortfolioElementType,
  solanaNativeAddress,
  solanaNativeDecimals,
  PortfolioAsset,
  PortfolioElement,
  getElementLendingValues,
  PortfolioAssetGeneric,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  cachePrefix,
  citrusIdlItem,
  collectionsCacheKey,
  loanDataSize,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { Collection, Loan } from './types';
import {
  getAutoParsedProgramAccounts,
  ParsedAccount,
} from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [accountsLender, accountsBorrower] = await Promise.all([
    getAutoParsedProgramAccounts<Loan>(connection, citrusIdlItem, [
      {
        dataSize: loanDataSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 9,
        },
      },
    ]),
    getAutoParsedProgramAccounts<Loan>(connection, citrusIdlItem, [
      {
        dataSize: loanDataSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 41,
        },
      },
    ]),
  ]);

  const accounts = [...accountsLender, ...accountsBorrower].filter(
    (acc) => !acc.status.repaid // hide past loans
  );

  if (accounts.length === 0) return [];

  const [solTokenPrice, collections] = await Promise.all([
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
    cache.getItem<ParsedAccount<Collection>[]>(collectionsCacheKey, {
      prefix: cachePrefix,
      networkId: NetworkId.solana,
    }),
  ]);
  if (!solTokenPrice || !collections) return [];

  const collectionsMap: Map<string, ParsedAccount<Collection>> = new Map();
  collections.forEach((cc) => {
    if (!cc) return;
    collectionsMap.set(cc.id, cc);
  });

  const elements: PortfolioElement[] = [];

  accounts.forEach((acc) => {
    const collection = collectionsMap.get(acc.collectionConfig);
    if (!collection) return;

    const borrowedAssets: PortfolioAsset[] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedLtvs: number[] = [];

    const mintAsset: PortfolioAssetGeneric | undefined =
      acc.mint && acc.mint !== '11111111111111111111111111111111'
        ? {
            type: 'generic',
            networkId: NetworkId.solana,
            value: new BigNumber(collection.floor)
              .multipliedBy(solTokenPrice.price)
              .toNumber(),
            attributes: {},
            data: {
              amount: 1,
              name: collection.name,
              price: new BigNumber(collection.floor)
                .multipliedBy(solTokenPrice.price)
                .toNumber(),
            },
          }
        : undefined;

    const solAsset = tokenPriceToAssetToken(
      solanaNativeAddress,
      new BigNumber(
        acc.ltvTerms ? acc.ltvTerms.maxOffer : acc.loanTerms.principal
      )
        .dividedBy(10 ** solanaNativeDecimals)
        .toNumber(),
      NetworkId.solana,
      solTokenPrice
    );

    let name;
    if (acc.lender === owner.toString()) {
      // LENDER
      suppliedAssets.push(solAsset);
      if (mintAsset) borrowedAssets.push(mintAsset);

      if (acc.status.waitingForBorrower) {
        name = `Lend Offer on ${collection.name}`;
      } else if (acc.status.active || acc.status.onSale) {
        name = `Active Loan on ${collection.name}`;
      } else if (acc.status.defaulted) {
        name = `Defaulted Loan on ${collection.name}`;
      }
    } else {
      // BORROWER
      if (mintAsset) {
        suppliedAssets.push(mintAsset);
        if (acc.loanTerms.principal !== '0') {
          suppliedLtvs.push(
            new BigNumber(acc.loanTerms.principal)
              .dividedBy(10 ** solanaNativeDecimals)
              .multipliedBy(100)
              .dividedBy(collection.floor)
              .toNumber()
          );
        }
      }

      borrowedAssets.push(solAsset);

      if (acc.status.waitingForLender) {
        name = `Borrow Offer on ${collection.name}`;
      } else if (acc.status.active || acc.status.onSale) {
        name = `Active Loan on ${collection.name}`;
      } else if (acc.status.defaulted) {
        name = `Expired Loan on ${collection.name}`;
      }
    }

    if (suppliedAssets.length > 0) {
      const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
        getElementLendingValues(
          suppliedAssets,
          borrowedAssets,
          [],
          suppliedLtvs
        );

      elements.push({
        networkId: NetworkId.solana,
        label: 'Lending',
        platformId,
        type: PortfolioElementType.borrowlend,
        value,
        name,
        data: {
          borrowedAssets,
          borrowedValue,
          borrowedYields: [],
          suppliedAssets,
          suppliedValue,
          suppliedYields: [],
          collateralRatio: null,
          rewardAssets: [],
          rewardValue,
          healthRatio,
          value,
        },
      });
    }
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
