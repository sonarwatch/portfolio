import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementMultiple,
  PortfolioElementType,
  getUsdValueSum,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { offerPid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { categoryOfferStruct, offerStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const categoryOfferAccounts = await getParsedProgramAccounts(
    connection,
    categoryOfferStruct,
    offerPid,
    [
      { memcmp: { offset: 0, bytes: 'C' } },
      {
        memcmp: {
          bytes: owner,
          offset: 50,
        },
      },
    ]
  );

  const offerAccounts = await getParsedProgramAccounts(
    connection,
    offerStruct,
    offerPid,
    [
      { memcmp: { offset: 0, bytes: '2' } },
      {
        memcmp: {
          bytes: owner,
          offset: 34,
        },
      },
    ]
  );
  if (offerAccounts.length === 0 && categoryOfferAccounts.length === 0)
    return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    [...offerAccounts.map((a) => a.mint.toString()), solanaNativeAddress],
    NetworkId.solana
  );

  const assets: PortfolioAssetToken[] = [];
  [
    ...offerAccounts,
    ...categoryOfferAccounts.map((a) => ({ ...a, mint: solanaNativeAddress })),
  ].forEach((acc) => {
    if (acc.amount.isZero()) return;
    const tokenPrice = tokenPrices.get(acc.mint.toString());
    if (!tokenPrice) return;
    const amount = acc.amount.div(10 ** tokenPrice.decimals).toNumber();
    const asset = tokenPriceToAssetToken(
      acc.mint.toString(),
      amount,
      NetworkId.solana,
      tokenPrice
    );
    assets.push(asset);
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
  id: `${platformId}-offers`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
