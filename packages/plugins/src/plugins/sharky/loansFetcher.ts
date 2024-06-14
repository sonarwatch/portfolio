import {
  getElementLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementType,
  solanaNativeAddress,
  solanaNativeDecimals,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
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
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getAssetBatchSafeDasAsMap } from '../../utils/solana/das/getAssetBatchDas';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { heliusAssetToAssetCollectible } from '../../utils/solana/das/heliusAssetToAssetCollectible';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const dasUrl = getSolanaDasEndpoint();
  const connection = getClientSolana();

  const accounts = (
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
    ])
  ).flat();

  if (accounts.length === 0) return [];

  const [solTokenPrice, collections, heliusAssets] = await Promise.all([
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
    cache.getItem<ParsedAccount<Collection>[]>(collectionsCacheKey, {
      prefix: cachePrefix,
      networkId: NetworkId.solana,
    }),
    getAssetBatchSafeDasAsMap(
      dasUrl,
      accounts
        .map((acc) => acc.loanState.taken?.taken.nftCollateralMint)
        .filter((mint) => mint) as string[]
    ),
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

    let mintAsset: PortfolioAssetCollectible | null = null;
    if (acc.loanState.taken?.taken.nftCollateralMint) {
      const heliusAsset = heliusAssets.get(
        acc.loanState.taken.taken.nftCollateralMint
      );

      if (heliusAsset) {
        mintAsset = heliusAssetToAssetCollectible(heliusAsset);
        if (mintAsset) {
          mintAsset.value = new BigNumber(collection.floor)
            .multipliedBy(solTokenPrice.price)
            .toNumber();
          mintAsset.data.price = new BigNumber(collection.floor)
            .multipliedBy(solTokenPrice.price)
            .toNumber();
          if (mintAsset.data.collection) {
            mintAsset.data.collection.name = collection.name;
            mintAsset.data.collection.floorPrice = new BigNumber(
              collection.floor
            )
              .multipliedBy(solTokenPrice.price)
              .toNumber();
          }
        }
      }
    }

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
