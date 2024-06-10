import {
  getElementLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetGeneric,
  PortfolioElement,
  PortfolioElementType,
  solanaNativeAddress,
  solanaNativeDecimals,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import {
  cachePrefix,
  collectionsCacheKey,
  loanDataSize,
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
import BigNumber from 'bignumber.js';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const [accountsTakenLender, accountsTakenBorrower, accountsOfferLender] =
    await Promise.all([
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, [
        {
          dataSize: loanDataSize,
        },
        {
          memcmp: {
            bytes: owner,
            offset: 115,
          },
        },
      ]),
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, [
        {
          dataSize: loanDataSize,
        },
        {
          memcmp: {
            bytes: owner,
            offset: 147,
          },
        },
      ]),
      getAutoParsedProgramAccounts<Loan>(connection, sharkyIdlItem, [
        {
          dataSize: loanDataSize,
        },
        {
          memcmp: {
            bytes: owner,
            offset: 83,
          },
        },
      ]),
    ]);

  const accounts = [
    ...accountsTakenLender,
    ...accountsTakenBorrower,
    ...accountsOfferLender,
  ];

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
    collectionsMap.set(cc.orderBook, cc);
  });

  const elements: PortfolioElement[] = [];

  accounts.forEach((acc) => {
    const collection = collectionsMap.get(acc.orderBook);
    if (!collection) return;

    const borrowedAssets: PortfolioAsset[] = [];
    const suppliedAssets: PortfolioAsset[] = [];

    const mintAsset: PortfolioAssetGeneric | undefined = acc.loanState.taken
      ?.taken.nftCollateralMint
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
      new BigNumber(acc.principalLamports)
        .dividedBy(10 ** solanaNativeDecimals)
        .toNumber(),
      NetworkId.solana,
      solTokenPrice
    );

    let name;

    if (acc.loanState.offer) {
      // LENDER
      suppliedAssets.push(solAsset);
      name = `Lend Offer on ${collection.name}`;
    } else if (acc.loanState.taken) {
      if (acc.loanState.taken.taken.lenderNoteMint === owner.toString()) {
        // LENDER
        suppliedAssets.push(solAsset);
        if (mintAsset) borrowedAssets.push(mintAsset);
        name = `Active Loan on ${collection.name}`;
      } else {
        // BORROWER
        if (mintAsset) {
          suppliedAssets.push(mintAsset);
        }
        borrowedAssets.push(solAsset);
        name = `Active Loan on ${collection.name}`;
      }
    }

    if (suppliedAssets.length > 0) {
      const { borrowedValue, suppliedValue, healthRatio, rewardValue } =
        getElementLendingValues(suppliedAssets, borrowedAssets, []);

      elements.push({
        networkId: NetworkId.solana,
        label: 'Lending',
        platformId,
        type: PortfolioElementType.borrowlend,
        value: suppliedValue,
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
          value: suppliedValue,
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
