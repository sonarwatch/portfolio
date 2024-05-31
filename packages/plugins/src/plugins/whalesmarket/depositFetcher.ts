import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { pid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { OfferStatus, OfferType, offerStruct } from './structs';
import { offerFilter } from './filters';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const offers = await getParsedProgramAccounts(
    client,
    offerStruct,
    pid,
    offerFilter(owner)
  );

  const mints: Set<string> = new Set();
  offers.forEach((offer) => mints.add(offer.exToken.toString()));
  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const buyOfferAssets = [];
  const sellOfferAssets = [];
  for (const offer of offers) {
    if (offer.status === OfferStatus.Closed || offer.collateral.isZero())
      continue;

    const mint = offer.exToken.toString();
    const tokenPrice = tokenPriceById.get(mint);
    if (!tokenPrice) continue;

    const amount = offer.collateral
      .dividedBy(10 ** tokenPrice.decimals)
      .toNumber();

    const asset = tokenPriceToAssetToken(
      mint,
      amount,
      NetworkId.solana,
      tokenPrice
    );

    if (offer.offerType === OfferType.Sell) {
      sellOfferAssets.push(asset);
    } else {
      buyOfferAssets.push(asset);
    }
  }

  if (sellOfferAssets.length === 0 && buyOfferAssets.length === 0) return [];

  const elements: PortfolioElement[] = [];
  if (sellOfferAssets.length > 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      name: 'Sell offers',
      networkId: NetworkId.solana,
      platformId,
      data: { assets: sellOfferAssets },
      value: getUsdValueSum(sellOfferAssets.map((asset) => asset.value)),
    });
  }

  if (buyOfferAssets.length > 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      name: 'Buy offers',
      networkId: NetworkId.solana,
      platformId,
      data: { assets: buyOfferAssets },
      value: getUsdValueSum(buyOfferAssets.map((asset) => asset.value)),
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
