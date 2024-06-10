import {
  NetworkId,
  PortfolioElementMultiple,
  PortfolioElementType,
  getUsdValueSum,
  solanaNativeAddress,
  solanaNativeDecimals,
  PortfolioAssetGeneric,
  PortfolioAsset,
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
import { CollectionConfig, Loan } from './types';
import {
  getAutoParsedProgramAccounts,
  ParsedAccount,
} from '../../utils/solana';
import { getCollectionName } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const [solTokenPrice, collections] = await Promise.all([
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
    cache.getItem<ParsedAccount<CollectionConfig>[]>(collectionsCacheKey, {
      prefix: cachePrefix,
      networkId: NetworkId.solana,
    }),
  ]);
  if (!solTokenPrice || !collections) return [];

  const collectionsMap: Map<
    string,
    ParsedAccount<CollectionConfig>
  > = new Map();
  collections.forEach((cc) => {
    if (!cc) return;
    collectionsMap.set(cc.pubkey.toString(), cc);
  });

  const connection = getClientSolana();

  const accounts = await getAutoParsedProgramAccounts<Loan>(
    connection,
    citrusIdlItem,
    [
      {
        dataSize: loanDataSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 9,
        },
      },
    ]
  ).then((accs) => accs.filter((acc) => !acc.status.repaid));

  if (accounts.length === 0) return [];

  const assets: PortfolioAsset[] = [];

  accounts.forEach((acc) => {
    console.log(acc, collectionsMap.get(acc.collectionConfig));

    const collectionName = getCollectionName(
      collectionsMap.get(acc.collectionConfig)
    );

    if (acc.status.waitingForBorrower) {
      const amount = acc.ltvTerms
        ? new BigNumber(acc.ltvTerms.maxOffer)
        : new BigNumber(acc.loanTerms.principal);

      const asset: PortfolioAssetGeneric = {
        networkId: NetworkId.solana,
        type: 'generic',
        value: amount
          .dividedBy(10 ** solanaNativeDecimals)
          .multipliedBy(solTokenPrice.price)
          .toNumber(),
        attributes: {},
        data: {
          name: `Offer on ${collectionName}`,
          amount: amount.dividedBy(10 ** solanaNativeDecimals).toNumber(),
          price: solTokenPrice.price,
        },
      };

      assets.push(asset);
    }
    /*
      case Status.WaitingForLender:
      case Status.Defaulted:
      case Status.Active:
      case Status.OnSale:
     */
  });

  if (assets.length === 0) return [];

  const element: PortfolioElementMultiple = {
    networkId: NetworkId.solana,
    label: 'Deposit',
    platformId,
    type: PortfolioElementType.multiple,
    value: getUsdValueSum(assets.map((a) => a.value)),
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-positions-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
